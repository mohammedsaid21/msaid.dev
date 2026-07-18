import { siteConfig } from '../../config/site'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { Marquee } from '../ui/Marquee'

export function Trust() {
  const { experience } = siteConfig
  return (
    <Section id="experience" subtle>
      <SectionHeading eyebrow="Experience" title={experience.title} />

      <Reveal className="mt-10">
        <Marquee speed={24}>
          {experience.categories.map((cat) => (
            <span
              key={cat}
              className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-canvas px-4 py-1.5 text-sm text-muted"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
              {cat}
            </span>
          ))}
        </Marquee>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
        {experience.credibility.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.06} className="bg-canvas">
            <div className="flex h-full items-start gap-3 p-7">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
                <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" aria-hidden="true">
                  <path
                    d="M3.5 8.5l3 3 6-6.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <h4 className="text-base font-semibold text-ink">{c.title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted">{c.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10 text-center">
        <p className="text-lg font-medium text-ink">{experience.tagline}</p>
      </Reveal>
    </Section>
  )
}
