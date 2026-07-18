import type { ReactNode } from 'react'
import { CTAButton } from '../ui/CTAButton'
import { useBooking } from './useBooking'

interface BookCallButtonProps {
  children?: ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'md' | 'sm'
  className?: string
}

/**
 * "Book a Call" trigger that opens the booking modal. Keeps the look of
 * CTAButton but routes the click to `useBooking().open()` instead of navigating.
 * `href="#contact"` remains as a no-JS fallback.
 */
export function BookCallButton({
  children = 'Book a Call',
  variant = 'primary',
  size = 'md',
  className,
}: BookCallButtonProps) {
  const { open } = useBooking()
  return (
    <CTAButton
      href="#contact"
      variant={variant}
      size={size}
      className={className}
      onClick={(e) => {
        e.preventDefault()
        open()
      }}
    >
      {children}
    </CTAButton>
  )
}
