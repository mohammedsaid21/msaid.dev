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

  return (
    <div className="flex h-full flex-col justify-center px-4 py-4 sm:px-8 sm:py-8">
      {expanded ? (
        <motion.div
          style={headingOpacity ? { opacity: headingOpacity } : { opacity: 1 }}
          className="text-start"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
            {t.proof.eyebrow}
          </p>
          <h2 className="mt-2 text-balance text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-4xl">
            {t.proof.title}
          </h2>
          <p className="mt-2 max-w-xl me-auto text-sm leading-relaxed text-muted sm:text-base">
            {t.proof.subtitle}
          </p>
        </motion.div>
      ) : (
        <p className="text-start text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
          {t.proof.eyebrow}
        </p>
      )}

      <div
        className={`grid gap-px overflow-hidden rounded-2xl border border-line bg-line ${
          expanded ? 'mt-8 grid-cols-2 sm:grid-cols-4' : 'mt-3 grid-cols-4 lg:grid-cols-2'
        }`}
      >
        {proof.metrics.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col items-center bg-canvas text-center ${
              expanded ? 'px-3 py-7 sm:py-9' : 'px-1 py-3 sm:px-2 sm:py-5'
            }`}
          >
            <div
              className={`font-semibold tabular-nums tracking-tight text-ink ${
                expanded ? 'text-3xl sm:text-5xl' : 'text-xl sm:text-3xl'
              }`}
            >
              <Counter value={m.value} />
            </div>
            <div
              className={`mt-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-subtle sm:text-[11px] ${
                expanded ? '' : 'max-lg:hidden'
              }`}
            >
              {t.proof.metrics[m.id]}
            </div>
          </div>
        ))}
      </div>

      {expanded && (
        <motion.div
          style={headingOpacity ? { opacity: headingOpacity } : { opacity: 1 }}
          className="mt-10"
        >
          <p className="text-center text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">
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
