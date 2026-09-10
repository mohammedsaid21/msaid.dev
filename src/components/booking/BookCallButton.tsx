import type { ReactNode } from 'react'
import { CTAButton } from '../ui/CTAButton'
import { useBooking } from './useBooking'
import { useLocale } from '../../i18n/LocaleProvider'

interface BookCallButtonProps {
  children?: ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'md' | 'sm'
  className?: string
}

export function BookCallButton({
  children,
  variant = 'primary',
  size = 'md',
  className,
}: BookCallButtonProps) {
  const { open } = useBooking()
  const { t } = useLocale()
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
      {children ?? t.nav.book}
    </CTAButton>
  )
}
