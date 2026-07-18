import { siteConfig } from '../../config/site'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'

const CAPTIONS = [
  'Every great product starts with a problem worth solving.',
  'We design an experience users genuinely enjoy.',
  'Built production-ready — fast, scalable, and maintainable.',
  'Shipped, measured, and continuously improved.',
]

function IdeaBody() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
      <svg viewBox="0 0 24 24" className="h-7 w-7 text-muted/50" fill="none" aria-hidden="true">
        <path
          d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10c.8.8 1 1.5 1 2h6c0-.5.2-1.2 1-2a6 6 0 00-4-10z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="grid w-full grid-cols-3 gap-1.5 opacity-70">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-6 rounded border border-dashed border-muted/40" />
        ))}
      </div>
    </div>
  )
}

function DesignBody({ accent }: { accent: string }) {
  return (
    <div className="grid h-full grid-cols-4 gap-2 p-3">
      <div className="col-span-1 flex flex-col gap-1.5">
        <div className="h-2.5 w-2.5 rounded" style={{ background: accent }} />
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-1.5 rounded bg-muted/15" style={{ width: `${70 - i * 12}%` }} />
        ))}
      </div>
      <div className="col-span-3 flex flex-col gap-1.5">
        <div className="h-3 rounded bg-muted/20" />
        <div className="grid flex-1 grid-cols-2 gap-1.5">
          <div className="rounded bg-muted/10" />
          <div className="rounded" style={{ background: `${accent}1a` }} />
        </div>
      </div>
    </div>
  )
}

function BuildBody() {
  return (
    <div className="flex h-full flex-col gap-1 overflow-hidden p-3 font-mono text-[10px] leading-relaxed">
      <div>
        <span className="text-fuchsia-500">const</span>{' '}
        <span className="text-ink">product</span>{' '}
        <span className="text-muted">= build(</span>
        <span className="text-indigo-500">idea</span>
        <span className="text-muted">)</span>
      </div>
      <div className="text-muted">// design → engineer → ship</div>
      <div>
        <span className="text-fuchsia-500">await</span>{' '}
        <span className="text-ink">product</span>
        <span className="text-muted">.deploy()</span>
      </div>
      <div>
        <span className="text-emerald-500">✓ shipped</span>
      </div>
    </div>
  )
}

function ShippedBody({ accent }: { accent: string }) {
  const metrics = [
    { v: '+35%', l: 'conv.' },
    { v: '98', l: 'perf' },
  ]
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-3">
      <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-600">
        <span className="h-1 w-1 rounded-full bg-emerald-500" />
        Live
      </div>
      <div className="grid w-full grid-cols-2 gap-1.5">
        {metrics.map((m) => (
          <div key={m.l} className="rounded-lg border border-line p-1.5 text-center">
            <div className="text-xs font-bold" style={{ color: accent }}>
              {m.v}
            </div>
            <div className="text-[8px] text-subtle">{m.l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StageWindow({ index }: { index: number }) {
  const cols = siteConfig.pipeline.columns
  const accent = cols[index].accent
  const bodies = [
    <IdeaBody key="idea" />,
    <DesignBody key="design" accent={accent} />,
    <BuildBody key="build" />,
    <ShippedBody key="shipped" accent={accent} />,
  ]
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-canvas shadow-[0_14px_44px_-20px_rgba(17,17,22,0.16)]">
      <div className="flex items-center gap-1.5 border-b border-line bg-canvas-subtle px-3 py-2.5">
        <span className="h-2 w-2 rounded-full bg-[#e2e2e6]" />
        <span className="h-2 w-2 rounded-full bg-[#e2e2e6]" />
        <span className="h-2 w-2 rounded-full bg-[#e2e2e6]" />
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ color: accent, background: `${accent}14` }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
          {cols[index].title}
        </span>
      </div>
      <div className="h-44">{bodies[index]}</div>
    </div>
  )
}

/**
 * "From idea to shipped" — shown as a compact 4-stage row (Idea → Design →
 * Build → Shipped). Normal (non-pinned) layout; the pinned scroll effect lives
 * only on the Products section.
 */
export function Pipeline() {
  const { pipeline } = siteConfig
  const cols = pipeline.columns
  return (
    <Section id="pipeline">
      <SectionHeading eyebrow="How it works" title={pipeline.title} />

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cols.map((c, i) => (
          <div key={c.id} className="flex flex-col gap-3">
            <StageWindow index={i} />
            <p className="text-center text-xs leading-relaxed text-muted">{CAPTIONS[i]}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
