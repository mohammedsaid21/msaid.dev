import { motion, type MotionValue } from 'framer-motion'
import { useLocale } from '../../i18n/LocaleProvider'
import type { WorkItem } from './types'

export function ProjectDetails({
  item,
  titleClip,
  titleOpacity,
  problemClip,
  problemOpacity,
  solutionClip,
  solutionOpacity,
  impactClip,
  impactOpacity,
  metaOpacity,
}: {
  item: WorkItem
  titleClip: MotionValue<string>
  titleOpacity: MotionValue<number>
  problemClip: MotionValue<string>
  problemOpacity: MotionValue<number>
  solutionClip: MotionValue<string>
  solutionOpacity: MotionValue<number>
  impactClip: MotionValue<string>
  impactOpacity: MotionValue<number>
  metaOpacity: MotionValue<number>
}) {
  const { t } = useLocale()

  return (
    <div className="flex max-w-md flex-col justify-center lg:max-w-lg">
      <motion.p
        style={{ opacity: titleOpacity }}
        className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent"
      >
        {item.category}
      </motion.p>
      <div className="mt-3 overflow-hidden">
        <motion.h3
          style={{ clipPath: titleClip, opacity: titleOpacity }}
          className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl"
        >
          {item.name}
        </motion.h3>
      </div>

      <div className="mt-8 overflow-hidden">
        <motion.div style={{ clipPath: problemClip, opacity: problemOpacity }}>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">
            {t.products.problem}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{item.problem}</p>
        </motion.div>
      </div>
      <div className="mt-5 overflow-hidden">
        <motion.div style={{ clipPath: solutionClip, opacity: solutionOpacity }}>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">
            {t.products.solution}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{item.solution}</p>
        </motion.div>
      </div>
      <div className="mt-5 overflow-hidden">
        <motion.div style={{ clipPath: impactClip, opacity: impactOpacity }}>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">
            {t.products.impact}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{item.impact}</p>
        </motion.div>
      </div>

      <motion.div style={{ opacity: metaOpacity }} className="mt-7 flex flex-wrap items-center gap-2">
        {item.tags?.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-line bg-canvas px-3 py-1 text-[11px] font-medium text-muted"
          >
            {tag}
          </span>
        ))}
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="ms-1 inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-accent"
          >
            {t.products.visit}
            <span aria-hidden className="rtl:rotate-180">
              →
            </span>
          </a>
        )}
      </motion.div>
    </div>
  )
}
