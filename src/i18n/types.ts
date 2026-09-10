export type Locale = 'en' | 'ar'

export type ProductId = 'forsati' | 'austath' | 'sticky' | 'hisabity'
export type ExperimentId = 'lumen' | 'ayla' | 'padelbook'

export interface Dictionary {
  seo: {
    title: string
    description: string
    jobTitle: string
  }
  nav: {
    work: string
    capabilities: string
    contact: string
    book: string
    langAria: string
    themeToLight: string
    themeToDark: string
  }
  hero: {
    available: string
    line1: string
    line2: string
    accent: string
    body: string
    book: string
    work: string
    github: string
    note: string
    modes: {
      partnership: string
      fixed: string
    }
    stats: {
      users: string
      products: string
      founders: string
    }
  }
  proof: {
    eyebrow: string
    title: string
    subtitle: string
    tools: string
    metrics: {
      users: string
      products: string
      founders: string
      years: string
    }
  }
  products: {
    eyebrow: string
    title: string
    problem: string
    solution: string
    impact: string
    visit: string
    items: Record<
      ProductId,
      { category: string; problem: string; solution: string; impact: string }
    >
  }
  experiments: {
    eyebrow: string
    title: string
    featured: string
    visit: string
    items: Record<ExperimentId, { category: string; description: string }>
  }
  capabilities: {
    eyebrow: string
    title: string
    label: string
    hint: string
    items: { title: string; body: string }[]
  }
  pipeline: {
    eyebrow: string
    title: string
    columns: { idea: string; design: string; build: string; shipped: string }
    captions: string[]
  }
  contact: {
    eyebrow: string
    headline: string
    body: string
    responseTime: string
    preferTalk: string
    book: string
    name: string
    namePlaceholder: string
    email: string
    whatsapp: string
    optional: string
    details: string
    detailsHint: string
    detailsPlaceholder: string
    budget: string
    submit: string
    sending: string
    successTitle: string
    successBody: string
    mailtoHint: string
    openEmail: string
    another: string
    errName: string
    errEmail: string
    errDetails: string
    errorBody: string
  }
  booking: {
    heading: string
    subtitle: string
    date: string
    time: string
    email: string
    message: string
    messagePlaceholder: string
    submit: string
    sending: string
    successTitle: string
    successBody: string
    mailtoBody: string
    errorBody: string
    errDate: string
    errTime: string
    errPast: string
    errEmail: string
    close: string
    done: string
    preferUpwork: string
    hireUpwork: string
    mailtoHint: string
    openEmail: string
  }
  footer: {
    work: string
    capabilities: string
    contact: string
    credit: string
  }
}
