import { siteConfig } from '../../config/site'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'

type Experiment = {
  category: string
  name: string
  accent: string
  image: string
  description: string
  url: string
  tags?: readonly string[]
  featured?: boolean
}

/** Pull a short hostname out of the live URL for the browser-chrome pill. */
function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return 'app.preview'
  }
}

function ExternalGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
      <path
        d="M6 3h7v7M13 3L6 10M11 9v4a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StarGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor" aria-hidden="true">
      <path d="M8 1.5l1.8 4.1 4.2.4-3.2 2.8 1 4.2L8 10.9 4.2 13l1-4.2L2 6l4.2-.4L8 1.5z" />
    </svg>
  )
}

function ExperimentCard({ p }: { p: Experiment }) {
  const featured = p.featured === true
  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-canvas transition-all duration-300 hover:-translate-y-1"
      style={{
        borderColor: featured ? `${p.accent}66` : undefined,
        boxShadow: featured
          ? `0 0 0 1px ${p.accent}40, 0 26px 60px -32px ${p.accent}`
          : '0 12px 40px -24px rgba(17,17,22,0.18)',
      }}
    >
      {/* Featured badge */}
      {featured && (
        <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
          <StarGlyph />
          Featured
        </span>
      )}

      {/* Browser-chrome frame + screenshot */}
      <div className="border-b border-line bg-canvas-subtle">
        <div className="flex items-center gap-2 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#e2e2e6]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e2e2e6]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e2e2e6]" />
          <span className="ml-2 hidden truncate rounded-md border border-line bg-canvas px-2.5 py-1 text-[10px] text-subtle sm:inline">
            {hostOf(p.url)}
          </span>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 z-[1] opacity-60"
            style={{ background: `radial-gradient(120% 120% at 0% 0%, ${p.accent}14, transparent 60%)` }}
          />
          <img
            src={p.image}
            alt={`${p.name} preview`}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <span
          className="inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-[11px] font-medium"
          style={{ color: p.accent, borderColor: `${p.accent}55`, background: `${p.accent}12` }}
        >
          {p.category}
        </span>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink">
          {featured ? (
            <span className="text-gradient animate-gradient">{p.name}</span>
          ) : (
            p.name
          )}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{p.description}</p>

        {p.tags && p.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-line bg-canvas px-2 py-0.5 text-[10px] font-medium text-subtle"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex-1" />
        <a
          href={p.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-2 text-sm font-semibold transition-colors"
          style={{ color: p.accent }}
        >
          Visit live site
          <span className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ExternalGlyph />
          </span>
        </a>
      </div>
    </article>
  )
}

/**
 * Compact "experiments" row — a 3-up grid of small product tiles shown right
 * after the big sticky "Selected work" panels. Lumen is flagged `featured` in
 * config and gets a Featured badge, glowing accent ring, and animated gradient
 * title so it leads the row.
 */
export function Experiments() {
  const { experiments } = siteConfig
  return (
    <Section id="experiments">
      <SectionHeading eyebrow="Experiments" title={experiments.title} />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {experiments.items.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08} className="h-full">
            <ExperimentCard p={p} />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
