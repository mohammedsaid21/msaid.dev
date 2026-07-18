import { useState, type ReactNode } from 'react'
import { BookingContext, type BookingContextValue } from './useBooking'
import { BookingModal } from './BookingModal'

/**
 * Renders the booking modal once, at the app root, and provides
 * `useBooking().open()` so any "Book a Call" button can trigger it
 * without prop-drilling.
 */
export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const value: BookingContextValue = {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }

  return (
    <BookingContext.Provider value={value}>
      {children}
      <BookingModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </BookingContext.Provider>
  )
}
