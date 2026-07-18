import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * Seamless infinite horizontal marquee. Content is rendered twice and the
 * track translates -50%, looping forever. `reverse` scrolls the other way.
 * Static under reduced motion.
 */
export function Marquee({
  children,
  speed = 26,
  reverse = false,
  className = '',
}: {
  children: ReactNode
  speed?: number
  reverse?: boolean
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="flex w-max gap-4 pr-4"
        animate={reduce ? undefined : { x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        <div className="flex gap-4">{children}</div>
        <div className="flex gap-4" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  )
}
