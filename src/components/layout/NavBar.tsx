import { siteConfig } from '../../config/site'
import { useLocale } from '../../i18n/LocaleProvider'
import { useTheme } from '../../theme/ThemeProvider'
import { BookCallButton } from '../booking/BookCallButton'
import { Logo } from '../ui/Logo'

export function NavBar() {
  const { t, locale, toggle } = useLocale()
  const { theme, toggle: toggleTheme } = useTheme()
  const brand = locale === 'ar' ? siteConfig.nameAr : siteConfig.shortName

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        <a
          href="#top"
          className="flex items-center gap-2.5"
          aria-label={`${brand} — home`}
        >
          <Logo size={32} />
          <span className="hidden text-sm font-semibold text-ink sm:block">{brand}</span>
        </a>

        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href="#work"
            className="hidden text-sm text-muted transition-colors hover:text-ink md:block"
          >
            {t.nav.work}
          </a>
          <a
            href="#capabilities"
            className="hidden text-sm text-muted transition-colors hover:text-ink md:block"
          >
            {t.nav.capabilities}
          </a>
          <a
            href="#contact"
            className="hidden text-sm text-muted transition-colors hover:text-ink md:block"
          >
            {t.nav.contact}
          </a>
          <a
            href={siteConfig.cv}
            download="Mohammed_Said_FullStack_Developer.pdf"
            className="hidden text-sm text-muted transition-colors hover:text-ink md:block"
          >
            {t.hero.cv}
          </a>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t.nav.themeToLight : t.nav.themeToDark}
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-line text-ink transition-colors hover:bg-canvas-subtle"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={t.nav.langAria}
            className="grid h-9 min-w-9 cursor-pointer place-items-center rounded-full border border-line px-2.5 text-xs font-semibold text-ink transition-colors hover:bg-canvas-subtle"
          >
            {locale === 'ar' ? 'EN' : 'ع'}
          </button>
          <BookCallButton size="sm">{t.nav.book}</BookCallButton>
        </div>
      </nav>
    </header>
  )
}

function SunIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 1.5v1.2M8 13.3v1.2M1.5 8h1.2M13.3 8h1.2M3.2 3.2l.9.9M11.9 11.9l.9.9M12.8 3.2l-.9.9M4.1 11.9l-.9.9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13 10.2A5.2 5.2 0 1 1 5.8 3 4.2 4.2 0 0 0 13 10.2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}
