import { useRef, useSyncExternalStore } from 'react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useLocale } from '../../i18n/LocaleProvider'
import { ProjectDetails } from './ProjectDetails'
import { ProjectVisual } from './ProjectVisual'
import type { WorkItem } from './types'

function subscribeLg(cb: () => void) {
  const mq = window.matchMedia('(min-width: 1024px)')
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

function useIsLg() {
  return useSyncExternalStore(
    subscribeLg,
    () => window.matchMedia('(min-width: 1024px)').matches,
    () => false,
  )
}

export function ProjectScene({
  item,
  index,
  onActive,
}: {
  item: WorkItem
  index: number
  onActive: (index: number) => void
}) {
  const reduce = useReducedMotion()
  const { dir } = useLocale()
  const isLg = useIsLg()
  const trackRef = useRef<HTMLElement>(null)
  const imageOnStart = index % 2 === 0
  const fromLeft = imageOnStart === (dir !== 'rtl')

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: isLg ? ['start start', 'end end'] : ['start 0.88', 'end 0.5'],
  })
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.28 })

  useMotionValueEvent(p, 'change', (v) => {
    if (v > 0.08 && v < 0.92) onActive(index)
  })

  const enterX = isLg ? 80 : 28
  const enterY = isLg ? 88 : 56
  const imageFromX = fromLeft ? -enterX : enterX
  const textFromX = -imageFromX

  const visualX = useTransform(p, [0, 0.14, 0.72, 1], [imageFromX, 0, 0, imageFromX * 0.3])
  const visualY = useTransform(p, [0, 0.16, 0.74, 1], [enterY, 0, 0, -22])
  const visualScale = useTransform(p, [0.06, 0.7], [1.08, 1])
  const visualOpacity = useTransform(p, [0, 0.1, 0.82, 1], [0.55, 1, 1, 0.8])
  const parallaxY = useTransform(p, [0, 1], [12, -16])
  const textX = useTransform(p, [0.04, 0.18, 0.74, 1], [textFromX, 0, 0, textFromX * 0.18])
  const textY = useTransform(p, [0.04, 0.18, 0.76, 1], [enterY * 0.65, 0, 0, -14])
  const titleClip = useTransform(p, [0.1, 0.22], ['inset(110% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'])
  const titleOpacity = useTransform(p, [0.08, 0.2], [0, 1])
  const problemClip = useTransform(p, [0.18, 0.3], ['inset(0% 0% 110% 0%)', 'inset(0% 0% 0% 0%)'])
  const problemOpacity = useTransform(p, [0.16, 0.3], [0, 1])
  const solutionClip = useTransform(p, [0.28, 0.4], ['inset(0% 0% 110% 0%)', 'inset(0% 0% 0% 0%)'])
  const solutionOpacity = useTransform(p, [0.26, 0.4], [0, 1])
  const impactClip = useTransform(p, [0.38, 0.5], ['inset(0% 0% 110% 0%)', 'inset(0% 0% 0% 0%)'])
  const impactOpacity = useTransform(p, [0.36, 0.5], [0, 1])
  const metaOpacity = useTransform(p, [0.44, 0.56], [0, 1])
  const numberY = useTransform(p, [0, 1], [32, -36])
  const numberOpacity = useTransform(p, [0.04, 0.16, 0.76, 1], [0, 0.14, 0.14, 0])

  if (reduce) {
    return (
      <article id={`work-${item.id}`} ref={trackRef} className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div
          className={`flex flex-col gap-10 lg:items-center lg:gap-16 ${
            imageOnStart ? 'lg:flex-row' : 'lg:flex-row-reverse'
          }`}
        >
          <div className="lg:w-1/2">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-full rounded-[1.6rem] border border-line object-cover object-top aspect-[16/10]"
              />
            )}
          </div>
          <div className="lg:w-1/2">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
              {item.category}
            </p>
            <h3 className="mt-3 text-3xl font-semibold text-ink">{item.name}</h3>
            <p className="mt-6 text-sm leading-relaxed text-muted">{item.problem}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">{item.solution}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">{item.impact}</p>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article
      id={`work-${item.id}`}
      ref={trackRef}
      className="relative py-16 pb-28 lg:h-[128vh] lg:py-0"
    >
      <div className="flex items-center overflow-visible lg:sticky lg:top-0 lg:h-svh lg:overflow-hidden">
        <motion.span
          aria-hidden
          style={{ y: numberY, opacity: numberOpacity }}
          className={`pointer-events-none absolute top-[10%] font-semibold leading-none text-ink select-none lg:top-[14%] ${
            imageOnStart ? 'start-0' : 'end-0'
          }`}
        >
          <span className="block px-4 text-[24vw] tracking-tighter lg:px-10 lg:text-[16vw]">
            {String(index + 1).padStart(2, '0')}
          </span>
        </motion.span>

        <div
          className={`relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-center gap-10 px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8 ${
            imageOnStart ? '' : 'lg:flex-row-reverse'
          }`}
        >
          <div className="lg:w-[54%]">
            <ProjectVisual
              name={item.name}
              image={item.image}
              url={item.url}
              index={index}
              x={visualX}
              y={visualY}
              scale={visualScale}
              opacity={visualOpacity}
              parallaxY={parallaxY}
            />
          </div>
          <motion.div style={{ x: textX, y: textY }} className="lg:w-[46%]">
            <ProjectDetails
              item={item}
              titleClip={titleClip}
              titleOpacity={titleOpacity}
              problemClip={problemClip}
              problemOpacity={problemOpacity}
              solutionClip={solutionClip}
              solutionOpacity={solutionOpacity}
              impactClip={impactClip}
              impactOpacity={impactOpacity}
              metaOpacity={metaOpacity}
            />
          </motion.div>
        </div>
      </div>
    </article>
  )
}
