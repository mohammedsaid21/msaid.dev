import { useCallback, useEffect, useState } from 'react'
import { siteConfig } from '../../config/site'
import { useLocale } from '../../i18n/LocaleProvider'
import { SectionHeading } from '../ui/SectionHeading'
import { ProjectProgress } from './ProjectProgress'
import { ProjectScene } from './ProjectScene'

export function ProjectShowcase() {
  const { products } = siteConfig
  const { t } = useLocale()
  const items = products.items.map((p) => ({
    ...p,
    ...t.products.items[p.id],
  }))
  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = document.getElementById('work')
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio > 0.06),
      { threshold: [0, 0.06, 0.2] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const onSelect = useCallback((index: number) => {
    const id = items[index]?.id
    if (!id) return
    document.getElementById(`work-${id}`)?.scrollIntoView({ behavior: 'smooth' })
  }, [items])

  return (
    <section id="work" className="relative w-full border-y border-line bg-canvas pb-10 lg:pb-20">
      <div className="mx-auto max-w-6xl px-6 pb-4 pt-24 sm:pt-28 lg:px-8">
        <SectionHeading align="left" eyebrow={t.products.eyebrow} title={t.products.title} />
      </div>

      {inView && (
        <ProjectProgress count={items.length} active={active} onSelect={onSelect} />
      )}

      {items.map((item, index) => (
        <ProjectScene key={item.id} item={item} index={index} onActive={setActive} />
      ))}
    </section>
  )
}
