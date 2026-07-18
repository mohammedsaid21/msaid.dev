import { motion, useReducedMotion } from 'framer-motion'

interface ScoreGaugeProps {
  score: number // 0–100
  label: string
}

function colorFor(score: number): string {
  if (score >= 90) return '#059669' // emerald
  if (score >= 50) return '#d97706' // amber
  return '#dc2626' // red
}

/**
 * Animated circular score gauge. Arc draws to the target on scroll into view.
 */
export function ScoreGauge({ score, label }: ScoreGaugeProps) {
  const reduce = useReducedMotion()
  const size = 116
  const stroke = 9
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference - (score / 100) * circumference
  const color = colorFor(score)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(17,17,22,0.08)"
            strokeWidth={stroke}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true }}
            transition={{ duration: reduce ? 0 : 1.1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className="text-2xl font-semibold text-ink">{score}</span>
        </div>
      </div>
      <span className="text-sm text-muted">{label}</span>
    </div>
  )
}
