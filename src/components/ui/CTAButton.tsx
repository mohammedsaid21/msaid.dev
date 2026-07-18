import { motion, useReducedMotion } from 'framer-motion'
import { type MouseEvent, type ReactNode } from 'react'

interface CTAButtonProps {
  href: string
  children: ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'md' | 'sm'
  className?: string
  /** Optional click handler (e.g. to open the booking modal instead of navigating). */
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
}

/**
 * Conversion CTA. Primary = animated indigo→violet→fuchsia gradient;
 * secondary = quiet outlined. Calm micro-interactions.
 */
export function CTAButton({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
}: CTAButtonProps) {
  const reduce = useReducedMotion()
  const base =
    'group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 will-change-transform'
  const sizes = {
    md: 'px-6 py-3 text-sm',
    sm: 'px-4 py-2 text-sm',
  }
  const variants = {
    primary:
      'text-white bg-[linear-gradient(100deg,#6366f1,#8b5cf6,#ec4899)] bg-[length:200%_auto] shadow-[0_8px_30px_-8px_rgba(139,92,246,0.55)] hover:bg-[position:100%_0] hover:shadow-[0_10px_36px_-8px_rgba(236,72,153,0.6)]',
    secondary: 'border border-line bg-canvas text-ink hover:bg-canvas-subtle',
  }

  return (
    <motion.a
      href={href}
      onClick={onClick}
      whileHover={!reduce ? { y: -1 } : undefined}
      whileTap={!reduce ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 26 }}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.a>
  )
}
