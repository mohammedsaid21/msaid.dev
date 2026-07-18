import { useRef, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * Wraps a child and pulls it toward the pointer on hover — a subtle, premium
 * "magnetic" effect. Disabled under reduced motion.
 */
export function Magnetic({
  children,
  strength = 0.35,
  className = '',
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 250, damping: 18 })
  const sy = useSpring(y, { stiffness: 250, damping: 18 })

  function onMove(e: MouseEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }

  function reset() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
