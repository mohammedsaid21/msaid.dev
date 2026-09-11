import { motion, type MotionValue } from 'framer-motion'
import { siteConfig } from '../../config/site'
import { useLocale } from '../../i18n/LocaleProvider'
import { Counter } from '../ui/Counter'
import { Marquee } from '../ui/Marquee'

export function ProofBody({
  expanded,
  headingOpacity,
}: {
  expanded: boolean
  headingOpacity?: MotionValue<number>
}) {
  const { t } = useLocale()
  const { proof } = siteConfig
  const [featured, ...rest] = proof.metrics

  return (
    <div
      className={`flex h-full flex-col ${
        expanded ? 'justify-center px-6 py-8 sm:px-12 sm:py-10' : 'justify-center px-4 py-3 sm:px-6'
      }`}
    >
      {expanded && (
        <motion.p
          style={headingOpacity ? { opacity: headingOpacity } : { opacity: 1 }}
          className="text-center text-[11px] font-medium uppercase tracking-[0.18em] text-accent"
        >
          {t.proof.eyebrow}
        </motion.p>
      )}

      <div
        className={
          expanded
            ? 'mt-5 flex flex-col items-center'
            : 'flex items-center gap-4 sm:gap-6'
        }
      >
        {!expanded && (
          <p className="shrink-0 text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
            {t.proof.eyebrow}
          </p>
        )}

        <div className={`relative ${expanded ? 'text-center' : 'shrink-0'}`}>
          {expanded && (
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[min(42vw,18rem)] w-[min(70vw,28rem)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-accent)_22%,transparent),transparent)]"
            />
          )}
          <p
            className={`font-semibold tabular-nums tracking-tight text-ink ${
              expanded
                ? 'text-[clamp(4.5rem,14vw,8.5rem)] leading-[0.88]'
                : 'text-2xl sm:text-3xl'
            }`}
          >
            <Counter value={featured.value} />
          </p>
          {expanded && (
            <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              {t.proof.metrics[featured.id]}
            </p>
          )}
        </div>

        {!expanded && <span aria-hidden className="hidden h-8 w-px shrink-0 bg-line sm:block" />}

        <div
          className={
            expanded
              ? 'mt-10 grid w-full max-w-3xl grid-cols-3 border-y border-line'
              : 'flex min-w-0 flex-1 items-center justify-around'
          }
        >
          {rest.map((m, i) => (
            <div
              key={m.id}
              className={
                expanded
                  ? `flex flex-col items-center px-2 py-6 text-center sm:py-7 ${
                      i < rest.length - 1 ? 'border-e border-line' : ''
                    }`
                  : 'flex flex-col items-center px-1 text-center'
              }
            >
              <p
                className={`font-semibold tabular-nums tracking-tight text-ink ${
                  expanded ? 'text-3xl sm:text-5xl' : 'text-lg sm:text-2xl'
                }`}
              >
                <Counter value={m.value} />
              </p>
              {expanded && (
                <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.14em] text-subtle sm:text-[11px]">
                  {t.proof.metrics[m.id]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {expanded && (
        <motion.div
          style={headingOpacity ? { opacity: headingOpacity } : { opacity: 1 }}
          className="mt-10 text-center"
        >
          <h2 className="mx-auto max-w-3xl text-pretty text-xl font-semibold tracking-tight text-ink sm:text-2xl lg:text-[1.85rem] lg:whitespace-nowrap">
            {t.proof.title}
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
            {t.proof.subtitle}
          </p>
          <p className="mt-10 text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">
            {t.proof.tools}
          </p>
          <div className="mt-4" dir="ltr">
            <Marquee speed={32}>
              {proof.techStack.map((tech) => (
                <span
                  key={tech}
                  className="flex items-center gap-2 rounded-full border border-line bg-canvas px-4 py-1.5 font-mono text-sm text-muted transition-colors hover:text-ink"
                >
                  <span className="h-1 w-1 rounded-full bg-accent" />
                  {tech}
                </span>
              ))}
            </Marquee>
          </div>
        </motion.div>
      )}
    </div>
  )
}
