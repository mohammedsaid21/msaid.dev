import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

/**
 * Playful floating soap bubbles scattered over the page.
 *
 * - Lives with the content (position: absolute over the full document height),
 *   so bubbles scroll away with the page rather than staying pinned.
 * - Biased to the left/right edges and (mostly) out of the middle column, so
 *   they stay playful without crowding the content.
 * - Decorative overlay: the wrapper is pointer-events-none so it never blocks
 *   the page; each bubble opts back into pointer-events-auto so it can be
 *   hovered/tapped.
 * - On hover (desktop) or tap (mobile) a bubble "pops" with a soft expanding
 *   ring + a burst of droplet particles, then quietly respawns somewhere new.
 * - Honors prefers-reduced-motion: fewer bubbles, no drift, gentle fade pop.
 * - Sits below the navbar / rail / modal / cursor via z-20.
 */

type RGB = `${number}, ${number}, ${number}`
const PALETTE: { rgb: RGB }[] = [
  { rgb: '139, 92, 246' }, // violet
  { rgb: '99, 102, 241' }, // indigo
  { rgb: '236, 72, 153' }, // fuchsia
  { rgb: '6, 182, 212' }, // cyan
]

const PARTICLES = 10

const rand = (min: number, max: number) => Math.random() * (max - min) + min
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

// Keep bubbles on the left/right edges and (mostly) out of the middle column
// where the content lives, so they stay playful without getting in the way.
const edgeX = () => {
  const r = Math.random()
  if (r < 0.46) return rand(2, 16) // left edge
  if (r < 0.92) return rand(84, 97) // right edge
  return rand(38, 62) // occasional middle, rare
}

type Cfg = {
  x: number
  y: number
  size: number
  rgb: RGB
  driftX: number
  driftY: number
  dur: number
  delay: number
}

const makeCfg = (): Cfg => ({
  x: edgeX(),
  // Bias ~30% of bubbles into the hero band (top of the page) so the hero has
  // visible life on first load; the rest spread over the whole document.
  y: Math.random() < 0.3 ? rand(6, 16) : rand(8, 86),
  size: rand(26, 60),
  rgb: pick(PALETTE).rgb,
  driftX: rand(-26, 26),
  driftY: rand(-22, 22),
  dur: rand(12, 20),
  delay: rand(0, 6),
})

const makeBurst = () =>
  Array.from({ length: PARTICLES }, (_, i) => {
    const angle = (i / PARTICLES) * Math.PI * 2 + rand(-0.25, 0.25)
    const dist = rand(24, 52)
    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      s: rand(3, 7),
      t: rand(0.5, 0.85),
    }
  })

function Bubble() {
  const reduce = useReducedMotion()
  const [cfg, setCfg] = useState<Cfg>(makeCfg)
  const [burst, setBurst] = useState(makeBurst)
  const [popped, setPopped] = useState(false)

  // After a pop settles, quietly respawn somewhere new.
  useEffect(() => {
    if (!popped) return
    const t = setTimeout(
      () => {
        setPopped(false)
        setCfg(makeCfg())
        setBurst(makeBurst())
      },
      reduce ? 1200 : 2600,
    )
    return () => clearTimeout(t)
  }, [popped, reduce])

  const pop = useCallback(() => setPopped(true), [])

  const c = cfg.rgb
  const highlight =
    'radial-gradient(circle at 30% 26%, rgba(255,255,255,0.95), rgba(255,255,255,0.18) 20%,' +
    ` rgba(${c},0.34) 56%, rgba(${c},0.10))`

  return (
    <div className="absolute" style={{ left: `${cfg.x}%`, top: `${cfg.y}%` }}>
      <motion.div
        className="relative"
        style={{ width: cfg.size, height: cfg.size }}
        animate={reduce ? undefined : { x: [0, cfg.driftX, 0], y: [0, cfg.driftY, 0] }}
        transition={
          reduce
            ? undefined
            : {
                duration: cfg.dur,
                delay: cfg.delay,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
              }
        }
      >
        <AnimatePresence>
          {!popped && (
            <motion.div
              key="bubble"
              aria-hidden
              data-cursor
              onHoverStart={pop}
              onPointerDown={pop}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.7, opacity: 0, transition: { duration: 0.16 } }}
              transition={{ type: 'spring', stiffness: 240, damping: 18 }}
              className="absolute inset-0 rounded-full"
              style={{
                pointerEvents: 'auto',
                cursor: 'none',
                background: highlight,
                border: `1px solid rgba(${c},0.42)`,
                boxShadow: `inset 0 0 14px rgba(${c},0.35), inset -3px -5px 12px rgba(255,255,255,0.32), 0 6px 22px rgba(${c},0.18)`,
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {popped && (
            <motion.div
              key="burst"
              aria-hidden
              className="absolute inset-0"
              style={{ pointerEvents: 'none' }}
            >
              <motion.span
                className="absolute left-1/2 top-1/2 rounded-full"
                style={{
                  width: cfg.size,
                  height: cfg.size,
                  marginLeft: -cfg.size / 2,
                  marginTop: -cfg.size / 2,
                  border: `2px solid rgba(${c},0.55)`,
                }}
                initial={{ scale: 0.25, opacity: 0.9 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
              {burst.map((p, i) => (
                <motion.span
                  key={i}
                  className="absolute left-1/2 top-1/2 rounded-full"
                  style={{
                    width: p.s,
                    height: p.s,
                    marginLeft: -p.s / 2,
                    marginTop: -p.s / 2,
                    background: `rgba(${c},0.92)`,
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.2 }}
                  transition={{ duration: p.t, ease: 'easeOut' }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export function Bubbles() {
  const reduce = useReducedMotion()
  const count = reduce ? 8 : 22
  // Stable ids so children persist across re-renders; each Bubble manages its
  // own lifecycle (pop + respawn) internally.
  const [ids] = useState(() => Array.from({ length: count }, (_, i) => i))

  // Span the full scrollable document (not the viewport) so the bubbles live
  // with the content and scroll away instead of staying pinned on screen.
  const [height, setHeight] = useState(() =>
    typeof document !== 'undefined' ? document.documentElement.scrollHeight : 0,
  )
  useEffect(() => {
    const measure = () => setHeight(document.documentElement.scrollHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-20 w-full overflow-hidden"
      style={{ height: height || undefined }}
    >
      {ids.map((id) => (
        <Bubble key={id} />
      ))}
    </div>
  )
}
