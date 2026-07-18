import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * Global custom cursor: a small fuchsia dot that tracks the pointer precisely,
 * and a larger indigo ring that follows with a spring lag and scales up over
 * interactive elements. Only renders on precise pointers and when motion is OK.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.6 })
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.6 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return
    setEnabled(true)

    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const target = e.target as HTMLElement | null
      setHovering(!!target?.closest('a, button, input, textarea, [data-cursor]'))
    }
    const leave = () => setVisible(false)

    window.addEventListener('pointermove', move)
    document.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-fuchsia"
        style={{ x, y, marginLeft: -4, marginTop: -4, opacity: visible ? 1 : 0 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-9 w-9 rounded-full border"
        style={{
          x: ringX,
          y: ringY,
          marginLeft: -18,
          marginTop: -18,
          opacity: visible ? 1 : 0,
        }}
        animate={{
          scale: hovering ? 1.7 : 1,
          borderColor: hovering ? 'rgba(236,72,153,0.9)' : 'rgba(99,102,241,0.6)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
    </>
  )
}
