import { useRef, type ReactNode } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import { siteConfig } from '../../config/site'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'

const ACCENTS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981']

/** Wrap a value into [min, max). Matches @motionone/utils wrap. */
function wrap(min: number, max: number, v: number) {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

/**
 * Scroll-velocity marquee: content drifts horizontally, and the drift
 * accelerates / reverses based on how fast (and which direction) you scroll.
 * Content is duplicated for a seamless loop.
 */
function VelocityMarquee({
  children,
  baseVelocity = 2.5,
}: {
  children: ReactNode
  baseVelocity?: number
}) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false })
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)
  const directionFactor = useRef(1)

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000)
    if (velocityFactor.get() < 0) directionFactor.current = -1
    else if (velocityFactor.get() > 0) directionFactor.current = 1
    moveBy += moveBy * velocityFactor.get()
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div className="overflow-hidden">
      <motion.div className="flex w-max gap-5" style={{ x }}>
        <div className="flex gap-5">{children}</div>
        <div className="flex gap-5" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  )
}

function FeatureVisual({ accent }: { accent: string }) {
  const bars = [45, 70, 55, 90, 60, 78]
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-canvas">
      <div className="flex items-center gap-1.5 border-b border-line bg-canvas-subtle px-3 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#e2e2e6]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#e2e2e6]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#e2e2e6]" />
        <span className="ml-2 h-1.5 w-16 rounded bg-canvas-subtle" />
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
                style={{ height: `${h}%`, background: i === 3 ? accent : '#dcdce3' }}
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
}: {
  item: { title: string; body: string }
  index: number
  accent: string
}) {
  return (
    <div className="w-[300px] shrink-0 overflow-hidden rounded-2xl border border-line bg-canvas shadow-[0_14px_44px_-20px_rgba(17,17,22,0.16)]">
      <div className="border-b border-line bg-canvas-subtle p-4">
        <FeatureVisual accent={accent} />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-line">{`0${index + 1}`}</span>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={{ color: accent, background: `${accent}14` }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
            Capability
          </span>
        </div>
        <h3 className="mt-2 text-base font-semibold text-ink">{item.title}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted">{item.body}</p>
      </div>
    </div>
  )
}

export function Capabilities() {
  const { capabilities } = siteConfig
  const items = capabilities.items
  const reduce = useReducedMotion()

  const cards = items.map((item, i) => (
    <CapabilityCard key={item.title} item={item} index={i} accent={ACCENTS[i % ACCENTS.length]} />
  ))

  return (
    <Section id="capabilities" subtle>
      <SectionHeading eyebrow="Capabilities" title={capabilities.title} />

      {reduce ? (
        // Reduced-motion: static grid, no continuous animation.
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{cards}</div>
      ) : (
        <div className="mt-12">
          <VelocityMarquee baseVelocity={2.5}>{cards}</VelocityMarquee>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-subtle">
        ↕ Scroll faster — the cards drift quicker and reverse direction.
      </p>
    </Section>
  )
}
