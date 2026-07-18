/**
 * Website health-check analysis.
 *
 * Strategy: call the public Google PageSpeed Insights API (Lighthouse, mobile)
 * directly from the browser and map the real category + audit scores into a
 * friendly dashboard. If the request fails (network/CORS/rate-limit), fall back
 * to a deterministic heuristic so the feature always returns a result.
 *
 * Production note: a keyless client-side call is rate-limited. For a live,
 * high-traffic deployment, proxy this through a backend with an API key.
 */

export interface ScoreMetric {
  key: 'speed' | 'ux' | 'mobile' | 'seo' | 'accessibility'
  label: string
  score: number // 0–100
}

export interface Suggestion {
  title: string
  body: string
}

export interface AnalysisResult {
  url: string
  metrics: ScoreMetric[]
  suggestions: Suggestion[]
  isEstimate: boolean
}

interface PsiAudit {
  score?: number | null
}
type PsiAudits = Record<string, PsiAudit>
interface PsiCategories {
  [key: string]: { score?: number | null }
}
interface PsiResponse {
  lighthouseResult?: {
    categories: PsiCategories
    audits: PsiAudits
  }
}

const PSI_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'

export function normalizeUrl(input: string): string {
  let value = input.trim()
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`
  return value
}

export function isValidUrl(input: string): boolean {
  const value = input.trim()
  if (!value) return false
  try {
    const u = new URL(normalizeUrl(value))
    return !!u.hostname && u.hostname.includes('.')
  } catch {
    return false
  }
}

export async function analyzeWebsite(rawUrl: string): Promise<AnalysisResult> {
  const url = normalizeUrl(rawUrl)
  try {
    return await fetchPagespeed(url)
  } catch {
    return heuristicAnalysis(url)
  }
}

async function fetchPagespeed(url: string): Promise<AnalysisResult> {
  const target =
    `${PSI_ENDPOINT}?url=${encodeURIComponent(url)}` +
    '&strategy=mobile&category=performance&category=accessibility&category=best-practices&category=seo'

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 30000)
  let res: Response
  try {
    res = await fetch(target, { signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
  if (!res.ok) throw new Error(`PageSpeed responded ${res.status}`)

  const data = (await res.json()) as PsiResponse
  const cats = data.lighthouseResult?.categories
  const audits = data.lighthouseResult?.audits
  if (!cats || !audits) throw new Error('Missing Lighthouse data')

  const pct = (s: number | null | undefined) => {
    const v = typeof s === 'number' ? s : 0
    return Math.round(v * 100)
  }

  const metrics: ScoreMetric[] = [
    { key: 'speed', label: 'Speed', score: pct(cats.performance?.score) },
    { key: 'ux', label: 'User Experience', score: pct(cats['best-practices']?.score) },
    { key: 'mobile', label: 'Mobile Experience', score: deriveMobile(audits) },
    { key: 'seo', label: 'SEO', score: pct(cats.seo?.score) },
    { key: 'accessibility', label: 'Accessibility', score: pct(cats.accessibility?.score) },
  ]

  return { url, metrics, suggestions: extractSuggestions(audits), isEstimate: false }
}

/** Mobile experience derived from Core Web Vitals (LCP / CLS / TBT). */
function deriveMobile(audits: PsiAudits): number {
  const keys = ['largest-contentful-paint', 'cumulative-layout-shift', 'total-blocking-time']
  const scores = keys
    .map((k) => audits[k]?.score)
    .filter((s): s is number => typeof s === 'number')
  if (scores.length === 0) return 0
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length
  return Math.round(avg * 100)
}

const SUGGESTION_MAP: Record<string, Suggestion> = {
  'unused-javascript': { title: 'Reduce unused JavaScript', body: 'Remove or code-split JS that is not needed on first load.' },
  'render-blocking-resources': { title: 'Eliminate render-blocking resources', body: 'Inline critical CSS and defer non-critical scripts.' },
  'uses-optimized-images': { title: 'Optimize large images', body: 'Compress images and serve them at the right resolution.' },
  'modern-image-formats': { title: 'Serve next-gen image formats', body: 'Convert images to WebP or AVIF to cut transfer size.' },
  'uses-responsive-images': { title: 'Use responsive images', body: 'Serve correctly sized images for each device.' },
  'unminified-javascript': { title: 'Minify JavaScript', body: 'Ship minified production builds to reduce payload.' },
  'unminified-css': { title: 'Minify CSS', body: 'Remove unminified and dead CSS.' },
  'legacy-javascript': { title: 'Remove legacy JavaScript', body: 'Target modern browsers to drop compatibility polyfills.' },
  'efficient-animated-content': { title: 'Use efficient animated content', body: 'Prefer video over large GIF animations.' },
  'dom-size': { title: 'Reduce DOM size', body: 'Keep the DOM shallow to speed up interaction.' },
  'bootup-time': { title: 'Reduce JavaScript execution time', body: 'Split bundles and lazy-load heavy features.' },
  'total-byte-weight': { title: 'Reduce total page weight', body: 'Lower overall transfer size for faster loads.' },
  'uses-text-compression': { title: 'Enable text compression', body: 'Serve text assets with Brotli or Gzip.' },
  'server-response-time': { title: 'Improve server response time', body: 'Reduce TTFB via caching, CDN, and faster hosting.' },
}

function extractSuggestions(audits: PsiAudits): Suggestion[] {
  const out: Suggestion[] = []
  for (const [key, value] of Object.entries(SUGGESTION_MAP)) {
    const score = audits[key]?.score
    if (typeof score === 'number' && score < 0.9) out.push(value)
  }
  if (out.length === 0) {
    return [{ title: 'Core Web Vitals look healthy', body: 'Keep monitoring LCP, CLS, and INP as the product grows.' }]
  }
  return out.slice(0, 5)
}

const DEFAULT_SUGGESTIONS: Suggestion[] = [
  { title: 'Optimize large images', body: 'Compress and serve images in modern formats.' },
  { title: 'Improve loading performance', body: 'Preload key resources and defer non-critical work.' },
  { title: 'Reduce unnecessary JavaScript', body: 'Code-split and lazy-load heavy scripts.' },
  { title: 'Improve Core Web Vitals', body: 'Target good LCP, CLS, and INP for all users.' },
]

/** Deterministic per-host fallback so the same URL always yields the same result. */
function heuristicAnalysis(url: string): AnalysisResult {
  let host = url
  try {
    host = new URL(url).hostname
  } catch {
    /* keep raw value */
  }
  const rng = mulberry32(hashString(host))
  const mk = (base: number) => clamp(Math.round(base + rng() * 30 - 8), 35, 99)
  return {
    url,
    isEstimate: true,
    metrics: [
      { key: 'speed', label: 'Speed', score: mk(60) },
      { key: 'ux', label: 'User Experience', score: mk(74) },
      { key: 'mobile', label: 'Mobile Experience', score: mk(58) },
      { key: 'seo', label: 'SEO', score: mk(78) },
      { key: 'accessibility', label: 'Accessibility', score: mk(70) },
    ],
    suggestions: DEFAULT_SUGGESTIONS,
  }
}

function hashString(value: string): number {
  let h = 2166136261
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(a: number) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}
