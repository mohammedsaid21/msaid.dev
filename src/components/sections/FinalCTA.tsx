import { siteConfig } from '../../config/site'
import { Section } from '../ui/Section'
import { Reveal } from '../ui/Reveal'
import { BookCallButton } from '../booking/BookCallButton'

export function FinalCTA() {
  const { finalCta } = siteConfig
  return (
    <Section id="contact" subtle>
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-line bg-canvas px-6 py-20 text-center sm:px-12 sm:py-24">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-accent-soft/80 to-transparent" />
          <h2 className="relative mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-[3rem] lg:leading-[1.1]">
            {finalCta.headline}
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-base text-muted sm:text-lg">
            {finalCta.subtitle}
          </p>
          <div className="relative mt-9 flex justify-center">
            <BookCallButton>
              {finalCta.button}
              <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </BookCallButton>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
