import { useRef, type MouseEvent } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion'
import { siteConfig } from '../../config/site'
import { NavBar } from '../layout/NavBar'
import { CTAButton } from '../ui/CTAButton'
import { BookCallButton } from '../booking/BookCallButton'
import { Magnetic } from '../ui/Magnetic'
import { ShipConsole } from './ShipConsole'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/**
 * Narrative hero. The left column carries the message (badge → headline →
 * supporting copy → social proof → CTA); the right column is the ShipConsole —
 * a living "idea → prototype → production → real users" panel that proves,
 * without words, that this person ships products.
 *
 * Restrained palette (white / soft gray / subtle purple), generous whitespace,
 * asymmetric grid. A faint purple glow sits behind the console and a soft cursor
 * spotlight tracks the pointer — no full-bleed gradient, no shader, no clutter.
 */
export function Hero() {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  const sx = useMotionValue(55)
  const sy = useMotionValue(35)
  const smoothX = useSpring(sx, { stiffness: 120, damping: 20 })
  const smoothY = useSpring(sy, { stiffness: 120, damping: 20 })
  const spotlight = useMotionTemplate`radial-gradient(560px circle at ${smoothX}% ${smoothY}%, rgba(99,102,241,0.06), transparent 65%)`

  function onMove(e: MouseEvent<HTMLElement>) {
    if (reduce || !sectionRef.current) return
    const r = sectionRef.current.getBoundingClientRect()
    sx.set(((e.clientX - r.left) / r.width) * 100)
    sy.set(((e.clientY - r.top) / r.height) * 100)
  }

  return (
    <section
      id="top"
      ref={sectionRef}
      onMouseMove={onMove}
      className="relative overflow-hidden bg-canvas"
    >
      {/* Soft purple glow behind the console — contained, never a full-bleed blur. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-16 h-[520px] w-[520px] rounded-full bg-accent/10 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-0 h-[420px] w-[420px] rounded-full bg-violet/10 blur-[140px]"
      />
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: spotlight }} />

      <NavBar />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 px-6 pb-28 pt-28 lg:grid-cols-12 lg:gap-10 lg:pb-32 lg:pt-36">
        {/* Left — narrative */}
        <div className="lg:col-span-7">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1.5 text-xs font-medium text-muted shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {siteConfig.role} · Available
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.7, delay: 0.08, ease: EASE }}
            className="mt-6 text-balance text-5xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-7xl"
          >
            I ship the <span className="text-accent">products</span> startups bet on.
          </motion.h1>

          {/* Supporting copy — the journey, explicit */}
          <motion.p
            initial={{ opacity: 0, y: reduce ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.7, delay: 0.18, ease: EASE }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            Got a half-built app that’s stuck — or just a rough idea? I take it from{' '}
            <span className="font-medium text-ink">prototype → production → real users.</span>
          </motion.p>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.7, delay: 0.28, ease: EASE }}
            className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted"
          >
            <span className="text-base tracking-tight text-accent">★★★★★</span>
            <span className="font-medium text-ink">Trusted by 40+ founders</span>
            <span className="text-subtle">·</span>
            <span>
              <span className="font-semibold text-ink">15,000+</span> users
            </span>
            <span className="text-subtle">·</span>
            <span>
              <span className="font-semibold text-ink">10+</span> shipped
            </span>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.7, delay: 0.36, ease: EASE }}
            className="mt-9"
          >
            <div className="flex flex-wrap items-center gap-3">
              <Magnetic>
                <BookCallButton variant="primary">
                  Book a Free Discovery Call
                  <ArrowIcon />
                </BookCallButton>
              </Magnetic>
              <CTAButton href="#work" variant="secondary">
                See my work
              </CTAButton>
            </div>
            <p className="mt-4 text-xs text-subtle">30-minute call · No obligation</p>
          </motion.div>
        </div>

        {/* Right — the proof (ShipConsole) */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 28, scale: reduce ? 1 : 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: reduce ? 0 : 0.8, delay: 0.3, ease: EASE }}
          className="lg:col-span-5"
        >
          <ShipConsole />
        </motion.div>
      </div>
    </section>
  )
}

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
