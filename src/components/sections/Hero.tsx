import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { siteConfig } from '../../config/site'
import { useLocale } from '../../i18n/LocaleProvider'
import { NavBar } from '../layout/NavBar'
import { CTAButton } from '../ui/CTAButton'
import { BookCallButton } from '../booking/BookCallButton'
import { ProofBody } from './Proof'

/**
 * Hero + "by the numbers" as one scroll scene.
 * A compact proof card sits on the inline-end (LTR right / RTL left).
 * Native scroll drives it to the center and grows it into the full section.
 */
export function Hero() {
  const reduce = useReducedMotion()
  const { t, locale, dir } = useLocale()
  const primaryName = locale === 'ar' ? siteConfig.nameAr : siteConfig.name
  const otherName = locale === 'ar' ? siteConfig.name : siteConfig.nameAr

  const trackRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [stage, setStage] = useState({ w: 1200, h: 800 })
  const [isLg, setIsLg] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const syncMq = () => setIsLg(mq.matches)
    syncMq()
    mq.addEventListener('change', syncMq)

    const el = stageRef.current
    const syncStage = () => {
      if (!el) return
      const r = el.getBoundingClientRect()
      setStage({ w: r.width, h: r.height })
    }
    syncStage()
    const ro = el ? new ResizeObserver(syncStage) : null
    if (el && ro) ro.observe(el)

    return () => {
      mq.removeEventListener('change', syncMq)
      ro?.disconnect()
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.35 })

  useMotionValueEvent(p, 'change', (v) => {
    const next = v > 0.32
    setExpanded((prev) => (next !== prev ? next : prev))
  })

  const startW = isLg ? 292 : Math.max(stage.w - 32, 280)
  const endW = Math.min(896, stage.w - 48)
  const startH = isLg ? 352 : 132
  const endH = Math.min(stage.h * 0.84, 720)
  const startInset = isLg ? 24 : 16
  const endInset = Math.max((stage.w - endW) / 2, 16)
  const startTop = isLg ? (stage.h - startH) / 2 : stage.h - startH - 20
  const endTop = Math.max((stage.h - endH) / 2, 72)

  const cardW = useTransform(p, [0, 0.62], [startW, endW])
  const cardH = useTransform(p, [0, 0.62], [startH, endH])
  const insetEnd = useTransform(p, [0, 0.62], [startInset, endInset])
  const cardTop = useTransform(p, [0, 0.62], [startTop, endTop])
  const headingOpacity = useTransform(p, [0.28, 0.52], [0, 1])
  const heroOpacity = useTransform(p, [0, 0.16, 0.36], [1, 0.5, 0])
  const heroShift = useTransform(p, [0, 0.36], [0, dir === 'rtl' ? 56 : -48])

  if (reduce) {
    return (
      <>
        <StaticHero
          t={t}
          primaryName={primaryName}
          otherName={otherName}
        />
        <section id="proof" className="relative w-full">
          <div className="mx-auto w-full max-w-4xl px-6 py-24">
            <ProofBody expanded />
          </div>
        </section>
      </>
    )
  }

  return (
    <section id="top" ref={trackRef} className="relative h-[220vh] bg-canvas">
      <div ref={stageRef} className="sticky top-0 h-svh overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,color-mix(in_srgb,var(--color-accent)_16%,transparent),transparent_62%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%27120%27 height=%27120%27><filter id=%27n%27><feTurbulence type=%27fractalNoise%27 baseFrequency=%270.8%27 numOctaves=%272%27/></filter><rect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%270.55%27/></svg>")',
          }}
        />

        <NavBar />

        <motion.div
          style={{ opacity: heroOpacity, x: heroShift }}
          className="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col justify-center px-6 pb-48 pt-24 text-center lg:max-w-none lg:items-start lg:justify-center lg:px-10 lg:pb-20 lg:pt-20 lg:text-start xl:ps-16 xl:pe-[22rem]"
        >
          <div className="lg:max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas-subtle px-3 py-1.5 text-xs font-medium text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {t.hero.available}
            </span>

            <p className="mt-6 text-sm font-medium tracking-wide text-muted">
              {primaryName}
              <span className="mx-2 text-subtle">·</span>
              <span className="text-subtle">{otherName}</span>
            </p>

            <h1 className="mt-2 text-balance text-[2.35rem] font-semibold leading-[1.12] text-ink sm:text-6xl lg:text-7xl ltr:tracking-tight">
              <span className="block">{t.hero.line1}</span>
              <span className="block">{t.hero.line2}</span>
              <span className="mt-1 block text-accent">{t.hero.accent}</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/75 sm:text-lg">
              {t.hero.body}
            </p>

            <ul className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <li className="rounded-full border border-line bg-canvas-subtle px-3.5 py-1.5 text-sm text-ink">
                {t.hero.modes.partnership}
              </li>
              <li className="rounded-full border border-line bg-canvas-subtle px-3.5 py-1.5 text-sm text-ink">
                {t.hero.modes.fixed}
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <BookCallButton variant="primary">
                {t.hero.book}
                <ArrowIcon />
              </BookCallButton>
              <CTAButton href="#work" variant="secondary">
                {t.hero.work}
              </CTAButton>
              <CTAButton href={siteConfig.social.github} variant="ghost">
                {t.hero.github}
              </CTAButton>
            </div>

            <p className="mt-4 text-xs text-subtle">{t.hero.note}</p>
          </div>
        </motion.div>

        <motion.aside
          id="proof"
          style={{
            width: cardW,
            height: cardH,
            top: cardTop,
            left: dir === 'rtl' ? insetEnd : 'auto',
            right: dir === 'rtl' ? 'auto' : insetEnd,
          }}
          className="absolute z-20 overflow-hidden rounded-3xl border border-line bg-canvas shadow-[0_28px_80px_-36px_rgba(0,0,0,0.28)]"
        >
          <ProofBody expanded={expanded} headingOpacity={headingOpacity} />
        </motion.aside>
      </div>
    </section>
  )
}

function StaticHero({
  t,
  primaryName,
  otherName,
}: {
  t: ReturnType<typeof useLocale>['t']
  primaryName: string
  otherName: string
}) {
  return (
    <section id="top" className="relative overflow-hidden bg-canvas">
      <NavBar />
      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-5xl flex-col items-center px-6 pb-20 pt-32 text-center sm:pt-36">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas-subtle px-3 py-1.5 text-xs font-medium text-muted">
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          {t.hero.available}
        </span>
        <p className="mt-6 text-sm font-medium tracking-wide text-muted">
          {primaryName}
          <span className="mx-2 text-subtle">·</span>
          <span className="text-subtle">{otherName}</span>
        </p>
        <h1 className="mt-2 text-balance text-[2.6rem] font-semibold leading-[1.12] text-ink sm:text-6xl lg:text-7xl ltr:tracking-tight">
          <span className="block">{t.hero.line1}</span>
          <span className="block">{t.hero.line2}</span>
          <span className="mt-1 block text-accent">{t.hero.accent}</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/75 sm:text-lg">{t.hero.body}</p>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <li className="rounded-full border border-line bg-canvas-subtle px-3.5 py-1.5 text-sm text-ink">
            {t.hero.modes.partnership}
          </li>
          <li className="rounded-full border border-line bg-canvas-subtle px-3.5 py-1.5 text-sm text-ink">
            {t.hero.modes.fixed}
          </li>
        </ul>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <BookCallButton variant="primary">
            {t.hero.book}
            <ArrowIcon />
          </BookCallButton>
          <CTAButton href="#work" variant="secondary">
            {t.hero.work}
          </CTAButton>
          <CTAButton href={siteConfig.social.github} variant="ghost">
            {t.hero.github}
          </CTAButton>
        </div>
      </div>
    </section>
  )
}

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0"
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
