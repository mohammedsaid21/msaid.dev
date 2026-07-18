import { useId } from 'react'

/**
 * Brand mark for Mohammed Said — a gradient, app-icon-style "M" monogram.
 *
 * Thinking behind it:
 *  - The "M" = Mohammed (the person behind the work).
 *  - The rounded-square container reads as a product/app icon (product engineer),
 *    not a generic developer glyph.
 *  - The indigo→violet→fuchsia gradient matches the site accent, so the logo
 *    always feels part of the same brand system.
 *  - Pure white geometric M on gradient = crisp at 16px (favicon) and 32px (nav).
 */
export function Logo({ size = 32, className }: { size?: number; className?: string }) {
  // Unique gradient id per instance so multiple Logos on the page don't clash.
  const gid = `msLogo${useId().replace(/:/g, '')}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="0.5" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="9" fill={`url(#${gid})`} />
      <path
        d="M8 22 V11 L16 19.5 L24 11 V22"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Up-right launch arrow — "ship & scale". */}
      <path
        d="M21 10 L26 5 M23.5 5 L26 5 L26 7.5"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
