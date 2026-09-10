import { siteConfig } from '../../config/site'
import { Logo } from '../ui/Logo'
import { useLocale } from '../../i18n/LocaleProvider'

export function Footer() {
  const year = new Date().getFullYear()
  const { t, locale } = useLocale()
  const brand = locale === 'ar' ? siteConfig.nameAr : siteConfig.shortName

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 py-12 lg:flex-row lg:justify-between lg:px-8">
        <div className="flex flex-col items-center gap-2 lg:items-start">
          <div className="flex items-center gap-2.5">
            <Logo size={32} />
            <span className="text-sm font-semibold text-ink">{brand}</span>
          </div>
          <p className="max-w-xs text-center text-xs text-subtle lg:text-start">
            {t.seo.description}
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
          <a href="#capabilities" className="transition-colors hover:text-ink">
            {t.footer.capabilities}
          </a>
          <a href="#work" className="transition-colors hover:text-ink">
            {t.footer.work}
          </a>
          <a href="#contact" className="transition-colors hover:text-ink">
            {t.footer.contact}
          </a>
        </nav>

        <div className="flex items-center gap-4">
          {(
            [
              ['LinkedIn', siteConfig.social.linkedin],
              ['GitHub', siteConfig.social.github],
              ['Upwork', siteConfig.social.upwork],
            ] as const
          ).map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-line px-6 py-5 lg:px-8">
        <p className="mx-auto max-w-7xl text-center text-xs text-subtle lg:text-start">
          © {year} {brand}. {t.footer.credit}
        </p>
      </div>
    </footer>
  )
}
