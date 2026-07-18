import type { ReactNode } from 'react'

interface SectionProps {
  id?: string
  children: ReactNode
  className?: string
  /** Alternate background for visual rhythm. */
  subtle?: boolean
}

/**
 * Consistent vertical rhythm + max-width container.
 */
export function Section({ id, children, className = '', subtle = false }: SectionProps) {
  return (
    <section
      id={id}
      className={`relative w-full ${subtle ? 'border-y border-line bg-canvas-subtle' : ''}`}
    >
      <div className={`mx-auto w-full max-w-7xl px-6 py-24 sm:py-28 lg:px-8 ${className}`}>
        {children}
      </div>
    </section>
  )
}
