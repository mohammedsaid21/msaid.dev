import { Reveal } from './Reveal'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

/**
 * Standard section heading: gradient eyebrow, tight display title, muted subtitle.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: SectionHeadingProps) {
  const alignment =
    align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'
  return (
    <Reveal className={`flex max-w-2xl flex-col gap-4 ${alignment}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
          <span className="text-gradient animate-gradient">{eyebrow}</span>
        </span>
      )}
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-[2.6rem] lg:leading-[1.12]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base leading-relaxed text-muted sm:text-lg">{subtitle}</p>
      )}
    </Reveal>
  )
}
