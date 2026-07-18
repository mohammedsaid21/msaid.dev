import { useReducedMotion } from 'framer-motion'

/**
 * A "rocket about to launch" — pure SVG + CSS (renders everywhere, including
 * headless, so it's verifiable). Tilted nose-up, with a flickering flame
 * exhaust and a warm launch glow. Inspired by amplemarket's hero rocket but
 * entirely our own artwork.
 */
export function LaunchingRocket({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion()
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 200 360" className="h-full w-auto animate-rocket-bob">
        <defs>
          <linearGradient id="lrFlame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFE066" />
            <stop offset="0.35" stopColor="#FF8A3D" />
            <stop offset="0.75" stopColor="#E8400D" />
            <stop offset="1" stopColor="#E8400D" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lrBody" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.5" stopColor="#ffffff" />
            <stop offset="1" stopColor="#e9edf5" />
          </linearGradient>
          <linearGradient id="lrNose" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FF7A1A" />
            <stop offset="1" stopColor="#E8400D" />
          </linearGradient>
        </defs>

        {/* tilt the whole assembly — nose pointing up-right, like lifting off */}
        <g transform="rotate(14 100 180)">
          {/* flame exhaust (flickers) */}
          {!reduce && (
            <g className="animate-flame">
              <path
                d="M100 250 C86 286 80 320 100 356 C120 320 114 286 100 250 Z"
                fill="url(#lrFlame)"
              />
              <path
                d="M100 260 C93 286 90 312 100 338 C110 312 107 286 100 260 Z"
                fill="#FFEED8"
              />
            </g>
          )}
          {!reduce || (
            <path d="M100 250 C86 286 80 320 100 356 C120 320 114 286 100 250 Z" fill="url(#lrFlame)" />
          )}

          {/* fins */}
          <path d="M76 212 L46 274 L76 250 Z" fill="#E8400D" />
          <path d="M124 212 L154 274 L124 250 Z" fill="#E8400D" />

          {/* body */}
          <rect x="76" y="118" width="48" height="138" rx="24" fill="url(#lrBody)" stroke="#E2E2E6" />
          <rect x="76" y="190" width="48" height="12" fill="#E8400D" />

          {/* window */}
          <circle cx="100" cy="160" r="15" fill="#0EA5E9" />
          <circle cx="100" cy="160" r="15" fill="none" stroke="#ffffff" strokeWidth="3" />
          <circle cx="95" cy="155" r="4" fill="#ffffff" opacity="0.75" />

          {/* nose cone */}
          <path d="M100 24 C122 66 122 108 100 140 C78 108 78 66 100 24 Z" fill="url(#lrNose)" />
        </g>
      </svg>
    </div>
  )
}
