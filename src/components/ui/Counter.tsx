import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

/**
 * Counts a numeric value up from 0 when it scrolls into view.
 * Pass strings like "4+", "30+", "40+" — the leading number animates and the
 * suffix is preserved.
 */
export function Counter({ value }: { value: string }) {
  const match = value.match(/^(\d+)(.*)$/)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(0)

  const target = match ? Number(match[1]) : 0
  const suffix = match ? match[2] : ''

  useEffect(() => {
    if (!inView || target === 0) return
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
  }, [inView, target, reduce])

  if (!match) return <>{value}</>
  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}
