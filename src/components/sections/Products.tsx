import type { ReactNode } from 'react'
import { siteConfig } from '../../config/site'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'

type Variant = 'saas' | 'business' | 'ecommerce'

function SaasMock({ accent }: { accent: string }) {
  return (
    <div className="flex h-full gap-3">
      <div className="hidden w-14 shrink-0 flex-col gap-2 sm:flex">
        <div className="h-3 w-3 rounded" style={{ background: accent }} />
      </div>
      <div className="flex-1">
        <div className="mb-3 h-4 w-1/2 rounded bg-canvas-subtle" />
        <div className="mb-3 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-lg border border-line bg-canvas p-2">
              <div className="h-2 w-8 rounded bg-canvas-subtle" />
              <div className="mt-1.5 h-3 w-10 rounded" style={{ background: accent, opacity: 0.75 }} />
            </div>
          ))}
        </div>
        <div className="flex h-24 items-end gap-1.5 rounded-lg border border-line bg-canvas p-3">
          {[40, 70, 50, 90, 60, 80, 55].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t"
              style={{ height: `${h}%`, background: i === 3 ? accent : '#dcdce3' }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function BusinessMock({ accent }: { accent: string }) {
  return (
    <div className="h-full">
      <div className="mb-3 flex items-center justify-between">
        <div className="h-4 w-24 rounded bg-canvas-subtle" />
        <div className="h-5 w-16 rounded" style={{ background: accent, opacity: 0.7 }} />
      </div>
      <div className="overflow-hidden rounded-lg border border-line">
        <div className="grid grid-cols-12 gap-2 bg-canvas-subtle px-3 py-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="col-span-3 h-2 rounded bg-line" />
          ))}
        </div>
        {[0, 1, 2, 3, 4].map((r) => (
          <div
            key={r}
            className="grid grid-cols-12 items-center gap-2 border-t border-line px-3 py-2"
          >
            <div className="col-span-5 h-2 rounded bg-canvas-subtle" />
            <div className="col-span-3 h-2 rounded bg-canvas-subtle" />
            <div className="col-span-4 flex justify-end">
              <div className="h-2 w-10 rounded" style={{ background: accent, opacity: 0.6 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EcommerceMock({ accent }: { accent: string }) {
  return (
    <div className="grid h-full grid-cols-2 gap-3 sm:grid-cols-3">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="overflow-hidden rounded-lg border border-line bg-canvas">
          <div
            className="h-16 w-full"
            style={{ background: `linear-gradient(135deg, ${accent}1f, transparent)` }}
          />
          <div className="p-2">
            <div className="h-2 w-3/4 rounded bg-canvas-subtle" />
            <div className="mt-2 h-2 w-1/3 rounded" style={{ background: accent, opacity: 0.75 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function PreviewBody({ variant, accent }: { variant: Variant; accent: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-line bg-canvas-subtle px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#e2e2e6]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#e2e2e6]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#e2e2e6]" />
        <span className="ml-3 rounded-md border border-line bg-canvas px-3 py-1 text-[10px] text-subtle">
          app.preview
        </span>
      </div>
      <div
        className="flex-1 p-5"
        style={{ background: `radial-gradient(120% 120% at 0% 0%, ${accent}0d, transparent 60%)` }}
      >
        {variant === 'saas' && <SaasMock accent={accent} />}
        {variant === 'business' && <BusinessMock accent={accent} />}
        {variant === 'ecommerce' && <EcommerceMock accent={accent} />}
      </div>
    </div>
  )
}

function Detail({
  label,
  icon,
  accent,
  children,
}: {
  label: string
  icon: ReactNode
  accent: string
  children: ReactNode
}) {
  return (
    <div>
      <div
        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em]"
        style={{ color: accent }}
      >
        {icon}
        {label}
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{children}</p>
    </div>
  )
}

function ProjectCard({ p }: { p: { category: string; name: string; accent: string; variant: Variant; image?: string; problem: string; solution: string; impact: string; url?: string; tags?: readonly string[] } }) {
  return (
    <div className="grid overflow-hidden rounded-3xl border border-line bg-canvas shadow-[0_24px_60px_-30px_rgba(17,17,22,0.22)] lg:grid-cols-[1fr_1fr]">
      <div className="group relative min-h-[32rem] overflow-hidden border-b border-line bg-canvas-subtle lg:border-b-0 lg:border-r">
        {p.image ? (
          <img
            src={p.image}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <PreviewBody variant={p.variant} accent={p.accent} />
        )}
      </div>
      <div className="flex flex-col justify-center p-8 lg:p-12">
        <span
          className="inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-medium"
          style={{ color: p.accent, borderColor: `${p.accent}55`, background: `${p.accent}12` }}
        >
          {p.category}
        </span>
        <h3 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{p.name}</h3>
        <div className="mt-6 flex flex-col gap-5">
          <Detail label="Problem" accent={p.accent} icon={<WarnGlyph />}>
            {p.problem}
          </Detail>
          <Detail label="Solution" accent={p.accent} icon={<CheckGlyph />}>
            {p.solution}
          </Detail>
          <Detail label="Impact" accent={p.accent} icon={<TrendGlyph />}>
            {p.impact}
          </Detail>
        </div>
        {p.tags && p.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-line bg-canvas px-2.5 py-1 text-[11px] font-medium text-muted"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        {p.url && (
          <a
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition-all hover:scale-105"
            style={{ color: p.accent, borderColor: p.accent }}
          >
            Visit live site
            <ExternalGlyph />
          </a>
        )}
      </div>
    </div>
  )
}

/**
 * "Selected work" — Noxus-style stacked sticky cards. Each project is a full
 * panel with `position: sticky`; as you scroll, a panel pins near the top and
 * the next one slides up to cover it. Pure CSS, no JS.
 */
export function Products() {
  const { products } = siteConfig
  const items = products.items
  return (
    <Section id="work" subtle>
      <SectionHeading eyebrow="Selected work" title={products.title} />

      <div className="mx-auto mt-12">
        {items.map((p, i) => (
          <div
            key={p.name}
            className="sticky top-24"
            style={{ marginBottom: i === items.length - 1 ? 0 : 24 }}
          >
            <ProjectCard p={p} />
          </div>
        ))}
      </div>
    </Section>
  )
}

function WarnGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
      <path d="M8 2l6 11H2L8 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M8 7v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="8" cy="11.5" r="0.8" fill="currentColor" />
    </svg>
  )
}

function CheckGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TrendGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
      <path d="M2.5 11l3.5-3.5 2.5 2.5L13.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 5h3.5v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
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
