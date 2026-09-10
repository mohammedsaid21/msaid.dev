import { useId } from 'react'

/** Brand mark — ember tile with a white M. */
export function Logo({ size = 32, className }: { size?: number; className?: string }) {
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
          <stop offset="0" stopColor="#e85d3a" />
          <stop offset="1" stopColor="#c44a2c" />
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
    </svg>
  )
}
