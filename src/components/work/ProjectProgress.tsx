export function ProjectProgress({
  count,
  active,
  onSelect,
}: {
  count: number
  active: number
  onSelect: (index: number) => void
}) {
  return (
    <>
      <nav
        aria-label="Selected work"
        className="pointer-events-auto fixed end-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 lg:end-6 lg:flex"
      >
        {Array.from({ length: count }, (_, i) => {
          const current = i === active
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              className="group flex cursor-pointer items-center gap-2"
              aria-current={current ? 'true' : undefined}
              aria-label={`Project ${String(i + 1).padStart(2, '0')}`}
            >
              <span
                className={`font-mono text-[10px] tracking-[0.14em] transition-colors ${
                  current ? 'text-ink' : 'text-subtle group-hover:text-muted'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="relative h-8 w-px overflow-hidden bg-line">
                <span
                  className={`absolute inset-x-0 top-0 h-full origin-top bg-accent transition-transform duration-500 ${
                    current ? 'scale-y-100' : 'scale-y-0'
                  }`}
                />
              </span>
            </button>
          )
        })}
      </nav>

      <nav
        aria-label="Selected work"
        className="pointer-events-auto fixed inset-x-0 bottom-5 z-30 flex justify-center lg:hidden"
      >
        <div className="flex items-center gap-3 rounded-full border border-line bg-canvas/85 px-4 py-2 backdrop-blur-md">
          {Array.from({ length: count }, (_, i) => {
            const current = i === active
            return (
              <button
                key={i}
                type="button"
                onClick={() => onSelect(i)}
                className="flex cursor-pointer items-center gap-1.5"
                aria-current={current ? 'true' : undefined}
                aria-label={`Project ${String(i + 1).padStart(2, '0')}`}
              >
                <span
                  className={`font-mono text-[10px] tracking-[0.14em] ${
                    current ? 'text-ink' : 'text-subtle'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                {current && <span className="h-px w-5 bg-accent" />}
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
