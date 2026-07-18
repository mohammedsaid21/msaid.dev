import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { siteConfig } from '../../config/site'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { BookCallButton } from '../booking/BookCallButton'
import { ScoreGauge } from '../healthcheck/ScoreGauge'
import { analyzeWebsite, isValidUrl, type AnalysisResult } from '../../lib/pagespeed'

type Status = 'idle' | 'loading' | 'result' | 'error'

function displayHost(input: string): string {
  try {
    return new URL(input.startsWith('http') ? input : `https://${input}`).hostname
  } catch {
    return input
  }
}

export function HealthCheck() {
  const { healthCheck } = siteConfig
  const reduce = useReducedMotion()
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!isValidUrl(url)) {
      setError('Please enter a valid website URL.')
      setStatus('error')
      return
    }
    setError('')
    setStatus('loading')
    setResult(null)
    try {
      const res = await analyzeWebsite(url)
      setResult(res)
      setStatus('result')
    } catch {
      setError('Could not analyze that URL. Please try another.')
      setStatus('error')
    }
  }

  function reset() {
    setStatus('idle')
    setResult(null)
    setUrl('')
    setError('')
  }

  const motionProps = {
    initial: { opacity: 0, y: reduce ? 0 : 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduce ? 0 : -12 },
    transition: { duration: reduce ? 0 : 0.4 },
  }

  return (
    <Section id="audit">
      <SectionHeading
        eyebrow="Website Health Check"
        title={healthCheck.title}
        subtitle={healthCheck.subtitle}
      />

      <Reveal className="mx-auto mt-12 max-w-3xl">
        <div className="rounded-3xl border border-line bg-canvas p-2 shadow-sm">
          <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <GlobeIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-subtle" />
              <input
                type="text"
                inputMode="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={healthCheck.placeholder}
                aria-label="Website URL"
                className="w-full rounded-2xl border border-transparent bg-canvas-subtle py-4 pl-12 pr-4 text-sm text-ink placeholder:text-subtle focus:border-accent focus:bg-canvas focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-hover hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'loading' ? 'Analyzing…' : 'Analyze Website'}
            </button>
          </form>
        </div>
        {error && status === 'error' && (
          <p className="mt-3 px-2 text-sm text-rose-600">{error}</p>
        )}
      </Reveal>

      <div className="mx-auto mt-8 max-w-5xl">
        <AnimatePresence mode="wait">
          {status === 'loading' && (
            <motion.div key="loading" {...motionProps}>
              <LoadingPanel host={displayHost(url)} />
            </motion.div>
          )}
          {status === 'result' && result && (
            <motion.div key="result" {...motionProps}>
              <ResultPanel result={result} onReset={reset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  )
}

function LoadingPanel({ host }: { host: string }) {
  return (
    <div className="rounded-3xl border border-line bg-canvas p-10 text-center shadow-sm">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-line border-t-accent" />
      <p className="mt-5 text-sm text-ink">
        Running Lighthouse checks on <span className="font-medium">{host}</span>
      </p>
      <p className="mt-1 text-xs text-subtle">
        Measuring performance, accessibility, SEO and Core Web Vitals…
      </p>
      <div className="mx-auto mt-6 h-1 w-56 overflow-hidden rounded-full bg-canvas-subtle">
        <motion.div
          className="h-full w-1/2 rounded-full bg-accent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </div>
  )
}

function ResultPanel({ result, onReset }: { result: AnalysisResult; onReset: () => void }) {
  const { healthCheck } = siteConfig
  return (
    <div className="rounded-3xl border border-line bg-canvas p-6 shadow-sm sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.2em] text-subtle">Analysis complete</p>
          <p className="mt-1 truncate text-lg font-medium text-ink">{result.url}</p>
        </div>
        <button
          onClick={onReset}
          className="shrink-0 text-sm text-muted transition-colors hover:text-ink"
        >
          ↺ New analysis
        </button>
      </div>

      {result.isEstimate && (
        <p className="mt-3 text-xs text-amber-600">
          Estimate based on heuristics — connect for a full Lighthouse audit.
        </p>
      )}

      <div className="mt-8 grid grid-cols-2 gap-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
        {result.metrics.map((m) => (
          <ScoreGauge key={m.key} score={m.score} label={m.label} />
        ))}
      </div>

      <div className="mt-10">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-subtle">
          Improvement opportunities
        </h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {result.suggestions.map((s) => (
            <li
              key={s.title}
              className="flex gap-3 rounded-xl border border-line bg-canvas-subtle p-4"
            >
              <WarnIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <div>
                <p className="text-sm font-medium text-ink">{s.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-accent/20 bg-accent-soft p-8 text-center">
        <p className="text-xl font-semibold text-ink">{healthCheck.ctaTitle}</p>
        <BookCallButton>{healthCheck.ctaButton}</BookCallButton>
      </div>
    </div>
  )
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 12h18M12 3c2.5 2.5 3.8 5.8 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.8-3.8-9S9.5 5.5 12 3z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function WarnIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4l9 16H3L12 4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M12 10v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="17.5" r="1" fill="currentColor" />
    </svg>
  )
}
