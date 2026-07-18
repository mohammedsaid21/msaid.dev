import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/**
 * Fade-and-rise on scroll into view. Animates once. Fully skipped under
 * prefers-reduced-motion.
 */
export function Reveal({ children, delay = 0, y = 24, className }: RevealProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
