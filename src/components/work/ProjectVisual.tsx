import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useRef, type PointerEvent } from 'react'
import { useLocale } from '../../i18n/LocaleProvider'

export function ProjectVisual({
  name,
  image,
  url,
  index,
  x,
  y,
  scale,
  opacity,
  parallaxY,
}: {
  name: string
  image?: string
  url?: string
  index: number
  x: MotionValue<number>
  y: MotionValue<number>
  scale: MotionValue<number>
  opacity: MotionValue<number>
  parallaxY: MotionValue<number>
}) {
  const { t } = useLocale()
  const wrapRef = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const cx = useMotionValue(0)
  const cy = useMotionValue(0)
  const tiltX = useSpring(mx, { stiffness: 120, damping: 22, mass: 0.4 })
  const tiltY = useSpring(my, { stiffness: 120, damping: 22, mass: 0.4 })
  const cursorOn = useMotionValue(0)
  const cursorOpacity = useSpring(cursorOn, { stiffness: 220, damping: 24 })

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== 'mouse') return
    const el = wrapRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
    cx.set(e.clientX)
    cy.set(e.clientY)
    cursorOn.set(1)
  }

  function onLeave() {
    mx.set(0)
    my.set(0)
    cursorOn.set(0)
  }

  const shiftX = useTransform(tiltX, [-0.5, 0.5], [-10, 10])
  const shiftY = useTransform(tiltY, [-0.5, 0.5], [-8, 8])

  const inner = (
    <motion.div
      ref={wrapRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x, y, opacity }}
      className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.6rem] border border-line bg-canvas-subtle shadow-[0_40px_90px_-48px_rgba(0,0,0,0.45)] lg:max-h-[62svh] lg:cursor-none"
    >
      <motion.div style={{ scale, x: shiftX, y: shiftY }} className="h-full w-full">
        <motion.div style={{ y: parallaxY }} className="h-[112%] w-full">
          {image ? (
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover object-top"
              draggable={false}
            />
          ) : (
            <div className="grid h-full place-items-center text-sm text-subtle">{name}</div>
          )}
        </motion.div>
      </motion.div>
      <span className="pointer-events-none absolute start-4 top-4 font-mono text-[11px] tracking-[0.16em] text-white/80 mix-blend-difference">
        {String(index + 1).padStart(2, '0')}
      </span>
    </motion.div>
  )

  return (
    <>
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" className="block lg:cursor-none" data-view-cursor>
          {inner}
        </a>
      ) : (
        inner
      )}
      {url && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed z-[80] hidden h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-center text-[11px] font-semibold leading-tight text-canvas lg:flex"
          style={{ left: cx, top: cy, opacity: cursorOpacity }}
        >
          {t.products.view}
          <span className="ms-0.5 rtl:hidden"> →</span>
        </motion.div>
      )}
    </>
  )
}
