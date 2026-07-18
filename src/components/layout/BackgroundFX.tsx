/**
 * Subtle hero background: a faint accent tint at the top that fades away.
 * Deliberately quiet — the typography carries the hero.
 */
export function BackgroundFX() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[520px] overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-accent-soft/70 via-canvas/0 to-transparent" />
    </div>
  )
}
