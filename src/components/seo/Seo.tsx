import { Helmet } from 'react-helmet-async'
import { siteConfig } from '../../config/site'
import { useLocale } from '../../i18n/LocaleProvider'
import { useTheme } from '../../theme/ThemeProvider'

export function Seo() {
  const { t, locale, dir } = useLocale()
  const { theme } = useTheme()
  const title = t.seo.title
  const description = t.seo.description
  const url = siteConfig.url
  const themeColor = theme === 'dark' ? '#0e1014' : '#f6f5f2'

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    alternateName: siteConfig.nameAr,
    jobTitle: t.seo.jobTitle,
    description,
    url,
    email: `mailto:${siteConfig.email}`,
    sameAs: Object.values(siteConfig.social),
    knowsAbout: [
      'Full Stack Development',
      'Frontend Engineering',
      'React',
      'Next.js',
      'Node.js',
      'TypeScript',
      'Product Design',
      'Web Performance',
      'Design Systems',
    ],
  }

  return (
    <Helmet>
      <html lang={locale} dir={dir} data-theme={theme} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="theme-color" content={themeColor} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content={locale === 'ar' ? 'ar_AR' : 'en_US'} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      <script type="application/ld+json">{JSON.stringify(personJsonLd)}</script>
    </Helmet>
  )
}
