/**
 * Identity, links, and structured project data.
 * All UI copy lives in src/i18n (en.ts / ar.ts).
 */
export const siteConfig = {
  name: 'Mohammed Said',
  nameAr: 'محمد سعيد',
  shortName: 'Mohammed Said',
  email: 'mohmmedsaidaker@gmail.com',
  url: 'https://msaid.app',
  cv: '/Mohammed_Said_FullStack_Developer.pdf',

  social: {
    linkedin: 'https://www.linkedin.com/in/engmohammedsaid',
    github: 'https://github.com/mohammedsaid21',
    upwork: 'https://www.upwork.com/freelancers/~01afd7175205b2dfdd',
    telegram: 'https://t.me/ayla2035',
  },

  heroStats: [
    { id: 'users' as const, value: '15K+' },
    { id: 'products' as const, value: '10+' },
    { id: 'founders' as const, value: '40+' },
  ],

  proof: {
    metrics: [
      { id: 'users' as const, value: '15K+' },
      { id: 'products' as const, value: '10+' },
      { id: 'founders' as const, value: '40+' },
      { id: 'years' as const, value: '4+' },
    ],
    techStack: [
      'React',
      'Next.js',
      'Node.js',
      'TypeScript',
      'React Native',
      'Supabase',
      'Tailwind',
      'Postgres',
      'Three.js',
      'Framer Motion',
    ],
  },

  products: {
    items: [
      {
        id: 'forsati' as const,
        name: 'Forsati',
        accent: '#7c5cbf',
        image: '/projects/forsati.webp',
        variant: 'saas' as const,
        tags: ['Scholarships', 'Matching', 'CV'],
        url: 'https://forsati-ten.vercel.app/',
      },
      {
        id: 'austath' as const,
        name: 'Austath Fanan',
        accent: '#22d3ee',
        image: '/projects/astath-fannan.webp',
        variant: 'ecommerce' as const,
        tags: ['Admin dashboard', 'iOS app', 'Android app'],
        url: 'https://www.austathfanan.com/',
      },
      {
        id: 'sticky' as const,
        name: 'Sticky Horse',
        accent: '#60a5fa',
        image: '/projects/sticky.webp',
        variant: 'saas' as const,
        tags: ['Next.js', 'Node.js', 'Supabase'],
        url: 'https://sticky.onl',
      },
      {
        id: 'hisabity' as const,
        name: 'Hisabity Plus',
        accent: '#a78bfa',
        image: '/projects/hisabatiy-plus.webp',
        variant: 'business' as const,
        tags: ['React Native'],
        url: 'https://hisabatiy-plus.vercel.app/',
      },
    ],
  },

  experiments: {
    items: [
      {
        id: 'lumen' as const,
        name: 'Lumen',
        accent: '#e85d3a',
        image: '/projects/lumen.webp',
        featured: true,
        url: 'https://lumen-jet-tau.vercel.app',
        tags: ['UI', 'Animations', 'Palettes'],
      },
      {
        id: 'ayla' as const,
        name: 'Ayla',
        accent: '#4fd1c5',
        image: '/projects/ayla.webp',
        url: 'https://voice-ai-demo-azure.vercel.app/',
        tags: ['AI voice', 'RTL / i18n', 'Realtime'],
      },
      {
        id: 'padelbook' as const,
        name: 'PadelBook',
        accent: '#10b981',
        image: '/projects/padelbook.webp',
        url: 'https://padelbook-premium.vercel.app/',
        tags: ['Booking', 'Clubs', 'Memberships'],
      },
    ],
  },

  pipeline: {
    columns: [
      { id: 'idea' as const, accent: '#94a3b8' },
      { id: 'design' as const, accent: '#e85d3a' },
      { id: 'build' as const, accent: '#f0a202' },
      { id: 'shipped' as const, accent: '#10b981' },
    ],
  },

  booking: {
    mailtoRecipient: 'mohmmedsaidaker@gmail.com',
  },
} as const

export type SiteConfig = typeof siteConfig
