import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

/**
 * ShipConsole — the hero's proof.
 *
 * A living product-lifecycle panel that animates the journey
 *   Idea → Prototype → Production → Real Users
 * on a gentle loop, so a visitor *sees* that the person ships products rather
 * than reading a claim. Each stage carries real micro-interactions: a commit
 * drops in, a wireframe fills into a UI, a build fills and deploys, and live
 * users tick up against an analytics sparkline — backed by a streaming event
 * feed (commits, build✓, deploys, API 200s, signups).
 *
 * Everything is DOM + framer-motion (no WebGL), so it renders everywhere. Under
 * prefers-reduced-motion it freezes on the finished "Users" state. The panel
 * tilts subtly toward the cursor for a premium, alive feel.
 */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const STAGES = ['Idea', 'Prototype', 'Production', 'Users'] as const

type Tone = 'commit' | 'build' | 'deploy' | 'api' | 'users'
type FeedEvent = { id: number; text: string; tone: Tone }

const EVENT_POOL: { text: string; tone: Tone }[] = [
  { text: 'feat: ship onboarding', tone: 'commit' },
  { text: 'fix: auth edge case', tone: 'commit' },
  { text: 'build ✓ · 12.4s', tone: 'build' },
  { text: 'tests ✓ · 86 passed', tone: 'build' },
  { text: 'deployed → production', tone: 'deploy' },
  { text: '200 OK · /api/users', tone: 'api' },
  { text: 'p95 · 84ms', tone: 'api' },
  { text: '+24 signed up', tone: 'users' },
]

const TONE_COLOR: Record<Tone, string> = {
  commit: 'var(--color-accent)',
  build: 'var(--color-violet)',
  deploy: '#10b981',
  api: 'var(--color-subtle)',
  users: '#10b981',
}

const fmt = (n: number) => n.toLocaleString('en-US')

/** Tiny inline analytics sparkline. */
function Sparkline({ data, className = '' }: { data: number[]; className?: string }) {
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const range = max - min || 1
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100
      const y = 26 - ((v - min) / range) * 22 - 2
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  return (
    <svg viewBox="0 0 100 28" preserveAspectRatio="none" className={className} aria-hidden="true">
      <polyline
        points={pts}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/** A micro UI mock that reads as a real product interface. */
function MiniMock({ active }: { active: boolean }) {
  return (
    <div className="flex h-9 items-center gap-2 rounded-md border border-line bg-canvas-subtle px-2">
      <span
        className="h-5 w-5 shrink-0 rounded transition-colors duration-500"
        style={{ background: active ? 'var(--color-accent)' : 'var(--color-line)' }}
      />
      <span className="flex flex-1 flex-col gap-1">
        <span className="h-1 w-10 rounded bg-canvas-subtle" style={{ background: active ? '#dcdce6' : '#ececef' }} />
        <span className="h-1 w-16 rounded" style={{ background: active ? 'var(--color-accent)' : '#ececef', opacity: active ? 0.7 : 1 }} />
      </span>
      <span className="flex items-end gap-0.5" style={{ color: active ? 'var(--color-accent)' : '#cfd0d6' }}>
        <span className="h-2 w-0.5 rounded-sm" style={{ background: 'currentColor' }} />
        <span className="h-3 w-0.5 rounded-sm" style={{ background: 'currentColor' }} />
        <span className="h-1.5 w-0.5 rounded-sm" style={{ background: 'currentColor' }} />
      </span>
    </div>
  )
}

function RailNode({ state }: { state: 'done' | 'active' | 'upcoming' }) {
  if (state === 'active') {
    return (
      <span className="relative flex h-3.5 w-3.5 items-center justify-center">
        <span className="absolute inline-flex h-3.5 w-3.5 animate-ping rounded-full bg-accent opacity-30" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-accent shadow-[0_0_0_4px_rgba(99,102,241,0.15)]" />
      </span>
    )
  }
  if (state === 'done') {
    return (
      <span className="flex h-3.5 w-3.5 items-center justify-center">
        <span className="h-2.5 w-2.5 rounded-full bg-accent" />
      </span>
    )
  }
  return (
    <span className="flex h-3.5 w-3.5 items-center justify-center">
      <span className="h-2.5 w-2.5 rounded-full border-2 border-line bg-canvas" />
    </span>
  )
}

export function ShipConsole({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion()
  const [stage, setStage] = useState<number>(reduce ? 3 : 0)
  const [users, setUsers] = useState(1284)
  const [spark, setSpark] = useState<number[]>(() =>
    Array.from({ length: 18 }, (_, i) => 5 + Math.sin(i / 1.7) * 2 + i * 0.35),
  )
  const [buildPct, setBuildPct] = useState(reduce ? 100 : 0)
  const [feed, setFeed] = useState<FeedEvent[]>(() =>
    (
      [
        { text: 'deployed → production', tone: 'deploy' },
        { text: 'build ✓ · 12.4s', tone: 'build' },
        { text: '+24 signed up', tone: 'users' },
      ] as { text: string; tone: Tone }[]
    ).map((e, i) => ({ ...e, id: i })),
  )
  const idRef = useRef(100)

  // Cursor tilt (subtle). Disabled under reduced motion.
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const tiltX = useSpring(rx, { stiffness: 120, damping: 18 })
  const tiltY = useSpring(ry, { stiffness: 120, damping: 18 })

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * 7)
    rx.set(-py * 7)
  }
  function onLeave() {
    rx.set(0)
    ry.set(0)
  }

  // Stage loop.
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setStage((s) => (s + 1) % 4), 1800)
    return () => clearInterval(t)
  }, [reduce])

  // Live users ticker.
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setUsers((u) => u + 1 + Math.floor(Math.random() * 5)), 950)
    return () => clearInterval(t)
  }, [reduce])

  // Sparkline drift.
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => {
      setSpark((prev) => {
        const last = prev[prev.length - 1]
        const next = Math.max(2, last + (Math.random() * 4 - 1.4))
        return [...prev.slice(1), next]
      })
    }, 750)
    return () => clearInterval(t)
  }, [reduce])

  // Build progress ramps while in the Production stage.
  useEffect(() => {
    if (reduce) return
    if (stage !== 2) {
      setBuildPct(stage > 2 ? 100 : 0)
      return
    }
    const t = setInterval(() => setBuildPct((p) => Math.min(100, p + 8)), 120)
    return () => clearInterval(t)
  }, [stage, reduce])

  // Streaming event feed.
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => {
      const e = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)]
      setFeed((prev) => [{ ...e, id: idRef.current++ }, ...prev].slice(0, 3))
    }, 1700)
    return () => clearInterval(t)
  }, [reduce])

  const railHeight = `${(stage / (STAGES.length - 1)) * 100}%`

  return (
    <div className={[className, '[perspective:1200px]'].join(' ')}>
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          rotateX: reduce ? 0 : tiltX,
          rotateY: reduce ? 0 : tiltY,
          transformStyle: 'preserve-3d',
        }}
        className="relative overflow-hidden rounded-2xl border border-line bg-canvas shadow-[0_40px_90px_-50px_rgba(17,17,22,0.35)]"
      >
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 border-b border-line bg-canvas-subtle px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#e7e7ec]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e7e7ec]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e7e7ec]" />
          <span className="ml-2 font-mono text-[11px] text-subtle">ship-feed · live</span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-medium text-emerald-600">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            production
          </span>
        </div>

        {/* Pipeline */}
        <div className="p-5 sm:p-6">
          <div className="relative pl-0.5">
            {/* rail track + traveling beam */}
            <div className="absolute bottom-3 left-[7px] top-3 w-px bg-line" />
            <motion.div
              className="absolute left-[7px] top-3 w-px"
              style={{ background: 'linear-gradient(to bottom, var(--color-accent), var(--color-violet))' }}
              animate={{ height: `calc(${railHeight} - 0px)` }}
              transition={{ duration: reduce ? 0 : 0.8, ease: EASE }}
            />

            <div className="flex flex-col">
              {STAGES.map((label, i) => {
                const state = i < stage ? 'done' : i === stage ? 'active' : 'upcoming'
                return (
                  <div key={label} className="relative flex items-start gap-4 py-2.5">
                    <div className="flex w-3.5 shrink-0 justify-center pt-0.5">
                      <RailNode state={state} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={`text-[13px] font-semibold transition-colors duration-300 ${
                            i <= stage ? 'text-ink' : 'text-subtle'
                          }`}
                        >
                          {label}
                        </span>
                        <StageStatus i={i} stage={stage} buildPct={buildPct} users={users} reduce={!!reduce} />
                      </div>
                      {i === 1 && (
                        <div className="mt-2 max-w-[200px]">
                          <MiniMock active={i <= stage} />
                        </div>
                      )}
                      {i === 3 && (
                        <div className="mt-2 flex max-w-[220px] items-center gap-3">
                          <Sparkline
                            data={spark}
                            className={`h-6 flex-1 transition-colors duration-500 ${
                              i <= stage ? 'text-accent' : 'text-line'
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Streaming event feed */}
          <div className="mt-4 flex flex-col gap-1.5 border-t border-line pt-4">
            <AnimatePresence initial={false}>
              {feed.map((e) => (
                <motion.div
                  key={e.id}
                  layout
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="flex items-center gap-2 font-mono text-[11px] text-muted"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: TONE_COLOR[e.tone] }} />
                  <span className="truncate">{e.text}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function StageStatus({
  i,
  stage,
  buildPct,
  users,
  reduce,
}: {
  i: number
  stage: number
  buildPct: number
  users: number
  reduce: boolean
}) {
  const reached = i <= stage

  if (i === 0) {
    return (
      <StatusPill reached={reached}>
        {reached ? 'committed' : 'queued'}
      </StatusPill>
    )
  }
  if (i === 1) {
    return <StatusPill reached={reached}>{reached ? '6 screens' : 'design'}</StatusPill>
  }
  if (i === 2) {
    if (stage > 2 || (stage === 2 && buildPct >= 100)) {
      return (
        <StatusPill reached tone="success">
          ✓ deployed
        </StatusPill>
      )
    }
    if (stage === 2) {
      return (
        <span className="flex items-center gap-2">
          <span className="h-1 w-16 overflow-hidden rounded-full bg-line">
            <motion.span
              className="block h-full rounded-full bg-accent"
              animate={{ width: reduce ? '100%' : `${buildPct}%` }}
              transition={{ duration: reduce ? 0 : 0.12, ease: 'linear' }}
            />
          </span>
          <span className="font-mono text-[11px] text-muted">{buildPct}%</span>
        </span>
      )
    }
    return <StatusPill reached={false}>—</StatusPill>
  }
  // Users
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[12px] tabular-nums text-ink">
      <span className={reached ? '' : 'text-subtle'}>{fmt(users)}</span>
      <span className="text-[10px] font-medium text-emerald-600">live</span>
    </span>
  )
}

function StatusPill({
  children,
  reached,
  tone = 'neutral',
}: {
  children: React.ReactNode
  reached?: boolean
  tone?: 'neutral' | 'success'
}) {
  const style: CSSProperties =
    tone === 'success'
      ? { color: '#059669', background: 'rgba(16,185,129,0.10)' }
      : reached
        ? { color: 'var(--color-accent)', background: 'rgba(99,102,241,0.10)' }
        : { color: 'var(--color-subtle)' }
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={tone === 'neutral' && !reached ? style : { ...style, border: 'none' }}
    >
      {children}
    </span>
  )
}
