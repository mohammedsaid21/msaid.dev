import { siteConfig } from '../../config/site'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { Counter } from '../ui/Counter'
import { Marquee } from '../ui/Marquee'

/**
 * Proof — a compact "by the numbers" band that replaces the old generic trust
 * strip. Real, verifiable metrics that count up on scroll, plus a refined
 * tech-stack marquee. Proof, not adjectives — and a restrained palette to match
 * the hero.
 */
export function Proof() {
  const { proof } = siteConfig
  return (
    <Section id="proof">
      <SectionHeading eyebrow={proof.eyebrow} title={proof.title} subtitle={proof.subtitle} />

      {/* Metrics — hairline-divided grid, count up on scroll */}
      <Reveal className="mt-12">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
          {proof.metrics.map((m) => (
            <div
              key={m.label}
              className="flex flex-col items-center bg-canvas px-4 py-9 text-center"
            >
              <div className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                <Counter value={m.value} />
              </div>
              <div className="mt-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Tech stack */}
      <Reveal className="mt-14" delay={0.05}>
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">
          Tools I build with
        </p>
        <div className="mt-5">
          <Marquee speed={32}>
            {proof.techStack.map((t) => (
              <span
                key={t}
                className="flex items-center gap-2 rounded-full border border-line bg-canvas px-4 py-1.5 font-mono text-sm text-muted transition-colors hover:text-ink"
              >
                <span className="h-1 w-1 rounded-full bg-accent" />
                {t}
              </span>
            ))}
          </Marquee>
        </div>
      </Reveal>
    </Section>
  )
}
