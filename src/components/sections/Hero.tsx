import { useRef, type MouseEvent, type ReactNode } from 'react'
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
import { Counter } from '../ui/Counter'
import { Marquee } from '../ui/Marquee'
import { HeroShader } from '../effects/HeroShader'
import { LaunchingRocket } from '../effects/LaunchingRocket'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const GRID =
  'linear-gradient(to right, rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.06) 1px, transparent 1px)'

function SignalChip({ label }: { label: string }) {
  return (
    <span className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-canvas/60 px-3 py-1.5 text-xs text-muted backdrop-blur">
      <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
      {label}
    </span>
  )
}

/** Amplemarket-style: drifting mesh + two scrolling rows of live "signals". */
function SignalsBackground() {
  const signals = siteConfig.heroSignals
  const rowA = signals.slice(0, Math.ceil(signals.length / 2))
  const rowB = signals.slice(Math.ceil(signals.length / 2))
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-60" />
      <HeroShader className="absolute inset-0 h-full w-full opacity-60 [mask-image:radial-gradient(120%_90%_at_50%_25%,transparent_30%,#000_80%)] [-webkit-mask-image:radial-gradient(120%_90%_at_50%_25%,transparent_30%,#000_80%)]" />
      {/* (rocket rendered as a foreground LaunchingRocket below) */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: GRID, backgroundSize: '40px 40px' }} />

      <div className="absolute inset-x-0 bottom-[8%] flex flex-col gap-12 opacity-50">
        <Marquee speed={42}>
          {rowA.map((s) => (
            <SignalChip key={s} label={s} />
          ))}
        </Marquee>
        <Marquee speed={48} reverse>
          {rowB.map((s) => (
            <SignalChip key={s} label={s} />
          ))}
        </Marquee>
      </div>

      <div
        className="absolute inset-0"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent, #000 14%, #000 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, #000 14%, #000 100%)',
        }}
      />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-canvas to-transparent" />
    </div>
  )
}

function Tile({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 20, scale: reduce ? 1 : 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : delay, ease: EASE }}
      className={`relative overflow-hidden rounded-3xl border border-line bg-canvas shadow-[0_10px_40px_-22px_rgba(17,17,22,0.14)] ${className}`}
    >
      {children}
    </motion.div>
  )
}

function FeaturedProjectTile() {
  const p = siteConfig.featuredProject
  return (
    <div className="flex h-full flex-col">
      {/* App window chrome */}
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2.5">
        <span className="h-2 w-2 rounded-full bg-[#e2e2e6]" />
        <span className="h-2 w-2 rounded-full bg-[#e2e2e6]" />
        <span className="h-2 w-2 rounded-full bg-[#e2e2e6]" />
        <span className="ml-2 text-[10px] text-subtle">{p.windowLabel}</span>
        <span className="ml-auto flex items-center gap-1 text-[9px] font-medium text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
      </div>

      {/* Real product screenshot */}
      <div className="relative overflow-hidden border-b border-line bg-canvas-subtle">
        <img
          src={p.image}
          alt={`${p.name} — ${p.category}`}
          loading="lazy"
          className="h-32 w-full object-cover object-top sm:h-36"
        />
        <span className="absolute right-2 top-2 rounded-md bg-white/80 px-1.5 py-0.5 text-[9px] font-semibold text-ink backdrop-blur-sm">
          {p.result}
        </span>
      </div>

      {/* Project details */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-medium uppercase tracking-wide text-subtle">{p.tag}</span>
          <span className="text-[10px] font-medium text-subtle">{p.category}</span>
        </div>
        <p className="text-sm font-semibold text-ink">{p.name}</p>
        <p className="text-[11px] leading-relaxed text-muted">{p.description}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {p.highlights.map((h) => (
            <span
              key={h}
              className="rounded-full border border-line bg-canvas px-2 py-0.5 text-[10px] font-medium text-muted"
            >
              {h}
            </span>
          ))}
        </div>
        <a
          href="#work"
          className="group mt-2 inline-flex w-fit items-center gap-1 text-[11px] font-semibold text-accent hover:underline"
        >
          View case study
          <svg
            className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
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
        </a>
      </div>
    </div>
  )
}

export function Hero() {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  const sx = useMotionValue(50)
  const sy = useMotionValue(20)
  const smoothX = useSpring(sx, { stiffness: 120, damping: 20 })
  const smoothY = useSpring(sy, { stiffness: 120, damping: 20 })
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${smoothX}% ${smoothY}%, rgba(99,102,241,0.10), transparent 65%)`

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
      className="relative flex min-h-screen flex-col overflow-hidden"
    >
      <SignalsBackground />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: spotlight }}
      />
      <NavBar />
      <LaunchingRocket className="pointer-events-none absolute z-[-1] block top-[8%] right-[-8px] h-[160px] w-[100px] opacity-60 sm:top-[2%] sm:right-[-25px] sm:h-[280px] sm:w-[180px] sm:opacity-100 lg:right-[-40px] lg:h-[420px] lg:w-[270px]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 items-center px-6 pb-16 pt-32 lg:pt-36">
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[220px] lg:grid-cols-6">
          {/* Headline + CTA */}
          <Tile
            delay={0.05}
            className="col-span-2 flex flex-col justify-center p-6 sm:p-8 lg:col-span-4 lg:row-span-2 lg:p-10"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-fuchsia-400/10 blur-3xl"
            />
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1 text-xs font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
              {siteConfig.role}
            </span>
            <h1 className="mt-4 text-balance text-3xl font-semibold leading-[1.05] tracking-tight text-gradient animate-gradient sm:text-4xl lg:text-5xl">
              {siteConfig.headline}
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
              {siteConfig.subhead}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted">
              <span>
                <span className="font-semibold text-ink">15,000+</span> users served
              </span>
              <span className="text-subtle">·</span>
              <span>
                <span className="font-semibold text-ink">10+</span> products shipped
              </span>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
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
            <p className="mt-3 text-xs text-subtle">30-minute call · No obligation</p>
          </Tile>

          {/* Featured project — proof of real work */}
          <Tile delay={0.12} className="col-span-2 p-3 lg:col-span-2 lg:row-span-2">
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-indigo-400/10 blur-3xl"
            />
            <FeaturedProjectTile />
          </Tile>

          {/* Outcome cards */}
          <Tile
            delay={0.18}
            className="col-span-1 flex flex-col justify-center p-6 lg:col-span-2"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-subtle">How I work</span>
            <div className="mt-2 text-2xl font-semibold text-gradient">Ship fast</div>
            <p className="mt-1 text-xs text-muted sm:text-sm">Idea → production, without the drag.</p>
          </Tile>
          <Tile
            delay={0.24}
            className="col-span-1 flex flex-col justify-center p-6 lg:col-span-2"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-subtle">Selected work</span>
            <div className="mt-2 text-2xl font-semibold text-gradient sm:text-3xl">
              <Counter value="10+" />
            </div>
            <p className="mt-1 text-xs text-muted sm:text-sm">products shipped</p>
          </Tile>
          <Tile
            delay={0.3}
            className="col-span-1 flex flex-col justify-center p-6 lg:col-span-2"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-subtle">Experience</span>
            <div className="mt-2 text-2xl font-semibold text-gradient sm:text-3xl">
              <Counter value="4+" />
            </div>
            <p className="mt-1 text-xs text-muted sm:text-sm">years, full-stack end-to-end</p>
          </Tile>
        </div>
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
