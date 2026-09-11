import { motion, useReducedMotion } from 'framer-motion'
import { type MouseEvent, type ReactNode } from 'react'

interface CTAButtonProps {
  href: string
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'md' | 'sm'
  className?: string
  download?: string
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
}

export function CTAButton({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  download,
  onClick,
}: CTAButtonProps) {
  const reduce = useReducedMotion()
  const base =
    'group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 will-change-transform'
  const sizes = {
    md: 'px-6 py-3 text-sm',
    sm: 'px-4 py-2 text-sm',
  }
  const variants = {
    primary: 'bg-ink text-canvas hover:bg-ink/90',
    secondary: 'border border-line bg-transparent text-ink hover:bg-canvas-subtle',
    ghost: 'border border-line bg-transparent text-muted hover:text-ink hover:bg-canvas-subtle',
  }
  const external = href.startsWith('http')

  return (
    <motion.a
      href={href}
      onClick={onClick}
      download={download}
      target={external && !download ? '_blank' : undefined}
      rel={external && !download ? 'noreferrer' : undefined}
      whileHover={!reduce ? { y: -1 } : undefined}
      whileTap={!reduce ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 26 }}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.a>
  )
}
