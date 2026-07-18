import { Helmet } from 'react-helmet-async'
import { siteConfig } from '../../config/site'

/**
 * Centralized document metadata for SEO and social sharing.
 * Values are also mirrored statically in index.html for first-paint crawlers;
 * this component enriches/overrides them at runtime.
 */
export function Seo() {
  const title = `${siteConfig.name} — ${siteConfig.role}`
  const description = siteConfig.description
  const url = siteConfig.url

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    description: siteConfig.description,
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
      <html lang={siteConfig.locale} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="theme-color" content="#ffffff" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteConfig.name} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      <script type="application/ld+json">
        {JSON.stringify(personJsonLd)}
      </script>
    </Helmet>
  )
}
