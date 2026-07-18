import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

/**
 * Minimal content card: hairline border on white, soft shadow on hover.
 * (Replaces the previous glassmorphism surface.)
 */
export function Card({ children, className = '', hover = true }: CardProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      whileHover={hover && !reduce ? { y: -3 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className={`group h-full rounded-2xl border border-line bg-canvas p-7 transition-all duration-300 hover:border-[#dcdce0] hover:shadow-[0_14px_44px_-16px_rgba(17,17,22,0.16)] ${className}`}
    >
      {children}
    </motion.div>
  )
}
