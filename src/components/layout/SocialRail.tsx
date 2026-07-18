import { useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { siteConfig } from '../../config/site'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/**
 * Fixed left-edge social rail (desktop only). Stays pinned while reading,
 * hidden over the hero (where the WebGL shader hurts icon contrast and the
 * focus belongs to the headline + CTA), and fades in — opacity only, no slide —
 * once the visitor scrolls past the hero. Hidden entirely on mobile.
 */
export function SocialRail() {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const [past, setPast] = useState(
    () => typeof window !== 'undefined' && window.scrollY > window.innerHeight * 0.85,
  )

  useMotionValueEvent(scrollY, 'change', (y) => {
    const next = y > window.innerHeight * 0.85
    if (next !== past) setPast(next)
  })

  const links = [
    { label: 'LinkedIn', href: siteConfig.social.linkedin, Icon: LinkedInIcon },
    { label: 'GitHub', href: siteConfig.social.github, Icon: GitHubIcon },
    { label: 'Upwork', href: siteConfig.social.upwork, Icon: UpworkIcon },
    { label: 'Email', href: `mailto:${siteConfig.email}`, Icon: MailIcon },
  ]

  return (
    <motion.div
      aria-label="Social links"
      className="fixed bottom-6 left-6 z-40 hidden flex-col items-center gap-5 lg:left-8 lg:flex"
      animate={{ opacity: past ? 1 : 0 }}
      transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
      style={{ pointerEvents: past ? 'auto' : 'none' }}
    >
      {links.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith('mailto:') ? undefined : '_blank'}
          rel="noreferrer"
          aria-label={label}
          title={label}
          className="text-subtle transition-colors duration-200 hover:text-accent"
        >
          <Icon />
        </a>
      ))}
      <span className="mt-1 h-16 w-px bg-gradient-to-b from-line to-transparent" />
    </motion.div>
  )
}

function LinkedInIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .77 0 1.73v20.54C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.3 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.12-.31-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.87.12 3.18.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
    </svg>
  )
}

function UpworkIcon() {
  // Briefcase — clean stand-in for the Upwork (freelance work) link.
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.5 4a2 2 0 0 0-2 2v1H4a2.5 2.5 0 0 0-2.5 2.5v9A2.5 2.5 0 0 0 4 21h16a2.5 2.5 0 0 0 2.5-2.5v-9A2.5 2.5 0 0 0 20 7h-3.5V6a2 2 0 0 0-2-2h-5zm0 2h5v1h-5V6z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M3.5 7.2 12 12.8l8.5-5.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
