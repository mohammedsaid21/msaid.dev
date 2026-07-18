import { siteConfig } from '../../config/site'
import { BookCallButton } from '../booking/BookCallButton'
import { Logo } from '../ui/Logo'

/**
 * Minimal top navigation. Transparent over the light hero.
 */
export function NavBar() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        <a
          href="#top"
          className="flex items-center gap-2.5"
          aria-label={`${siteConfig.shortName} — home`}
        >
          <Logo size={32} />
          <span className="hidden text-sm font-semibold text-ink sm:block">
            {siteConfig.shortName}
          </span>
        </a>

        <div className="flex items-center gap-7">
          <a
            href="#capabilities"
            className="hidden text-sm text-muted transition-colors hover:text-ink md:block"
          >
            Capabilities
          </a>
          <a
            href="#work"
            className="hidden text-sm text-muted transition-colors hover:text-ink md:block"
          >
            Work
          </a>
          <BookCallButton size="sm">
            Book a Call
          </BookCallButton>
        </div>
      </nav>
    </header>
  )
}
