import { createContext, useContext } from 'react'

export type BookingContextValue = {
  isOpen: boolean
  open: () => void
  close: () => void
}

/** Internal React context — consumed by `useBooking`, provided by `BookingProvider`. */
export const BookingContext = createContext<BookingContextValue | null>(null)

/**
 * Access the booking modal from any component inside <BookingProvider>.
 * `open()` shows the "Book a Call" modal.
 */
export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext)
  if (!ctx) {
    throw new Error('useBooking must be used within <BookingProvider>')
  }
  return ctx
}
