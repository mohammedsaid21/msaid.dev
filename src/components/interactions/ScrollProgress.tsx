import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * Slim gradient progress bar pinned to the very top of the viewport that fills
 * as the page is scrolled — a continuous "the app is alive" signal.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  })

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[80] h-0.5 origin-left bg-[linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899)]"
      style={{ scaleX }}
    />
  )
}
