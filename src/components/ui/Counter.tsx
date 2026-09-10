import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

/**
 * Counts a numeric value up from 0 when it scrolls into view.
 * Pass strings like "4+", "30+", "40+" — the leading number animates and the
 * suffix is preserved.
 *
 * `armed` overrides in-view: false shows the final value, true counts up once.
 * `dir="ltr"` keeps suffixes like "15K+" from flipping in RTL.
 */
export function Counter({ value, armed }: { value: string; armed?: boolean }) {
  const match = value.match(/^(\d+)(.*)$/)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const target = match ? Number(match[1]) : 0
  const suffix = match ? match[2] : ''
  const parsed = Boolean(match)
  const started = useRef(false)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!parsed || target === 0) return
    if (armed === false) {
      setDisplay(target)
      started.current = true
      return
    }
    const go = armed === undefined ? inView : armed
    if (!go || started.current) return
    started.current = true
    if (reduce) {
      setDisplay(target)
      return
    }
    const controls = animate(0, target, {
      duration: 1.3,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [armed, inView, target, reduce, parsed])

  if (!match) return <>{value}</>
  return (
    <span ref={ref} dir="ltr">
      {display}
      {suffix}
    </span>
  )
}
