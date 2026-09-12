import { useLocale } from '../../i18n/LocaleProvider'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'

const ACCENTS = ['#e85d3a', '#f0a202', '#4fd1c5', '#a78bfa']

function FeatureVisual({ accent }: { accent: string }) {
  const bars = [45, 70, 55, 90, 60, 78]
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-canvas">
      <div className="flex items-center gap-1.5 border-b border-line bg-canvas-subtle px-3 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-line" />
        <span className="h-1.5 w-1.5 rounded-full bg-line" />
        <span className="h-1.5 w-1.5 rounded-full bg-line" />
        <span className="ms-2 h-1.5 w-16 rounded bg-canvas-subtle" />
      </div>
      <div
        className="grid grid-cols-3 gap-2 p-3"
        style={{ background: `radial-gradient(120% 120% at 0% 0%, ${accent}12, transparent 60%)` }}
      >
        <div className="col-span-1 flex flex-col gap-1.5">
          <div className="h-2 w-2 rounded" style={{ background: accent }} />
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-1.5 rounded bg-canvas-subtle" style={{ width: `${70 - i * 12}%` }} />
          ))}
        </div>
        <div className="col-span-2 flex flex-col gap-2">
          <div className="h-2.5 w-3/4 rounded bg-canvas-subtle" />
          <div className="flex h-14 items-end gap-1">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t"
                style={{ height: `${h}%`, background: i === 3 ? accent : 'var(--color-line)' }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CapabilityCard({
  item,
  index,
  accent,
  label,
}: {
  item: { title: string; body: string }
  index: number
  accent: string
  label: string
}) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-canvas shadow-[0_14px_44px_-20px_rgba(0,0,0,0.45)]">
      <div className="border-b border-line bg-canvas-subtle p-4">
        <FeatureVisual accent={accent} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xl font-semibold text-line">{String(index + 1).padStart(2, '0')}</span>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={{ color: accent, background: `${accent}14` }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
            {label}
          </span>
        </div>
        <h3 className="mt-2 text-base font-semibold text-ink">{item.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.body}</p>
      </div>
    </article>
  )
}

export function Capabilities() {
  const { t } = useLocale()
  const items = t.capabilities.items

  return (
    <Section id="capabilities" subtle>
      <SectionHeading eyebrow={t.capabilities.eyebrow} title={t.capabilities.title} />
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <CapabilityCard
            key={item.title}
            item={item}
            index={i}
            accent={ACCENTS[i % ACCENTS.length]}
            label={t.capabilities.label}
          />
        ))}
      </div>
    </Section>
  )
}
