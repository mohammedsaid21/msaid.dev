/**
 * Central site configuration + all section copy.
 *
 * Edit this file to personalize the brand, links, and every piece of marketing
 * copy on the site. Components read from here so you only update one place.
 */
export const siteConfig = {
  // ---- Brand / identity ----
  name: "Mohammed Said",
  shortName: "Mohammed Said",
  role: "Full Stack Product Engineer",

  headline: "Your idea, shipped. Your AI prototype, finished.",
  subhead:
    "Startups: I'll build your product from scratch. Stuck with a Claude or Lovable app? I'll finish, fix, and scale it.",
  description:
    "Full Stack Product Engineer partnering with founders and teams to design, build, launch, and scale high-performance web applications — from idea to production. React, Next.js, and Node.js.",

  // ---- Featured project (shown in the hero as proof of real work) ----
  featuredProject: {
    tag: "Featured project",
    windowLabel: "Austath Fanan",
    name: "Austath Fanan",
    category: "E-learning platform",
    description: "Web + mobile apps for streaming courses, learning offline, and taking assessments.",
    result: "15,000+ students",
    highlights: ["90+ courses", "3,000+ videos", "iOS + Android"],
    image: "/projects/astath-fannan.webp",
  },

  url: "https://msaid.app",
  bookingUrl: "#contact",
  capabilitiesUrl: "#capabilities",
  email: "mohmmedsaidaker@gmail.com",
  locale: "en",

  // ---- Hero trust signals (outcome-focused, not a tech list) ----
  stats: [
    { value: "4+", label: "Years building products" },
    { value: "10+", label: "Products shipped" },
    { value: "40+", label: "Founders & teams partnered" },
  ],

  social: {
    linkedin: "https://www.linkedin.com/in/mohammedsaid21",
    github: "https://github.com/mohammedsaid21",
    upwork: "https://www.upwork.com/freelancers/~01afd7175205b2dfdd",
  },

  // ---- Section 2: Proof (by the numbers) ----
  proof: {
    eyebrow: "By the numbers",
    title: "Real products. Real users. Real scale.",
    subtitle: "Outcomes from shipping production software for startups and teams.",
    metrics: [
      { value: "15K+", label: "Users served" },
      { value: "10+", label: "Products shipped" },
      { value: "40+", label: "Founders & teams" },
      { value: "4+", label: "Years building" },
    ],
    techStack: [
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "React Native",
      "Supabase",
      "Tailwind",
      "Postgres",
      "Three.js",
      "Framer Motion",
    ],
  },

  // ---- Section 3: Why companies choose me ----
  why: {
    title: "More than a developer. A product partner.",
    cards: [
      {
        title: "Business Understanding",
        body: "I don't just build features. I understand the goals behind every product.",
      },
      {
        title: "Quality First",
        body: "Creating fast, maintainable, and reliable applications ready for real users.",
      },
      {
        title: "Modern Engineering",
        body: "Using modern technologies and best practices to build scalable solutions.",
      },
      {
        title: "Ownership",
        body: "Taking responsibility from the first idea until launch.",
      },
    ],
  },

  // ---- Section 4: Capabilities ----
  capabilities: {
    title: "How I help companies build products",
    items: [
      {
        title: "Product Interfaces",
        body: "Creating intuitive interfaces that users enjoy.",
      },
      {
        title: "Frontend Architecture",
        body: "Building scalable frontend foundations that grow with the product.",
      },
      {
        title: "Design Systems",
        body: "Creating consistent UI systems that improve speed and quality.",
      },
      {
        title: "Product Launch Support",
        body: "Helping startups move from idea to production.",
      },
    ],
  },

  // ---- Section 5: Website Health Check ----
  healthCheck: {
    title: "See how your website performs",
    subtitle:
      "Analyze your website performance, user experience, and technical health.",
    ctaTitle: "Want to improve your website performance?",
    ctaButton: "Book a Performance Review",
    placeholder: "Enter your website URL (e.g. your-company.com)",
  },

  // ---- Section 6: Selected product experiences ----
  products: {
    title: "Products I helped bring to life",
    items: [
      {
        category: "E-learning platform",
        name: "Austath Fanan",
        accent: "#22d3ee",
        image: "/projects/astath-fannan.webp",
        variant: "ecommerce" as const,
        tags: ["Admin dashboard", "iOS app", "Android app"],
        problem: "Students needed flexible access to high-quality educational content without relying only on traditional classrooms or private tutoring.",
        solution: "A complete learning platform with an admin dashboard and native iOS & Android apps — students stream or download courses, take assessments, and access premium content.",
        impact: "Served 15,000+ students across 90+ courses and 3,000+ videos, with full admin control over content, subscriptions, teachers, and students.",
        url: "https://www.austathfanan.com/",
      },
      {
        category: "SaaS platform",
        name: "Sticky Horse",
        accent: "#60a5fa",
        image: "/projects/sticky.webp",
        variant: "saas" as const,
        tags: ["Next.js", "Node.js", "Supabase"],
        problem: "Customer feedback was scattered across channels, making it hard to organize, prioritize, and turn into product improvements.",
        solution: "An embeddable feedback tool — drop it into your app to collect, organize, and act on user feedback from one searchable workspace.",
        impact: "Helped teams make faster product decisions, cut manual work, and keep all customer feedback in one searchable workspace.",
        url: "https://sticky.onl",
      },
      {
        category: "Business application",
        name: "Hisabity Plus",
        accent: "#a78bfa",
        image: "/projects/hisabatiy-plus.webp",
        variant: "business" as const,
        tags: ["React Native"],
        problem: "Small business owners relied on paper records and spreadsheets, making it hard to track daily sales, expenses, debts, and reconcile bank statements.",
        solution: "A mobile-first accounting platform to record daily activity, import bank statements (Excel/CSV), auto-compare transactions, and flag discrepancies.",
        impact: "Streamlined daily bookkeeping, cut manual reconciliation, and gave owners a clear view of cash flow, expenses, and outstanding debts in one app.",
        url: "https://hisabatiy-plus.vercel.app/",
      },
    ],
  },

  // ---- Section 7: Side projects / experiments (compact 3-up row) ----
  experiments: {
    title: "More things I've built",
    items: [
      {
        category: "UI inspiration",
        name: "Lumen",
        accent: "#6366f1",
        image: "/projects/lumen.webp",
        featured: true,
        description:
          "UI animation inspiration — live demos, copyable code, and curated palettes in one immersive place.",
        url: "https://lumen-jet-tau.vercel.app",
        tags: ["UI inspiration", "Animations", "Palettes"],
      },
      {
        category: "AI voice assistant",
        name: "Ayla",
        accent: "#4fd1c5",
        image: "/projects/ayla.webp",
        description:
          "Real-time, in-browser AI voice assistant fluent in Arabic and English — the whole UI flips RTL/LTR to match the spoken language, with live audio-reactive visuals.",
        url: "https://voice-ai-demo-azure.vercel.app/",
        tags: ["AI voice", "RTL / i18n", "Realtime"],
      },
      {
        category: "Sports platform",
        name: "PadelBook",
        accent: "#10b981",
        image: "/projects/padelbook.webp",
        description:
          "All-in-one platform for padel clubs — court reservations, tournaments, memberships, and player experiences.",
        url: "https://padelbook-premium.vercel.app/",
        tags: ["Booking", "Clubs", "Memberships"],
      },
    ],
  },

  // ---- Section 8: Work process ----
  process: {
    title: "From idea to production",
    steps: [
      { no: "01", title: "Discover", body: "Understanding goals, users, and requirements." },
      { no: "02", title: "Design", body: "Creating user experiences and product flows." },
      { no: "03", title: "Build", body: "Engineering production-ready applications." },
      { no: "04", title: "Launch & Improve", body: "Optimizing performance and continuously improving." },
    ],
  },

  // ---- Hero ambient "signals" (amplemarket-style scrolling feed) ----
  heroSignals: [
    'Deployed to production',
    'Lighthouse score 98',
    'Shipped a design system',
    'Reduced bundle size 40%',
    'Launched SaaS MVP',
    'Cut load time by 1.2s',
    '+35% conversion',
    'Migrated to TypeScript',
    'Accessibility audit passed',
    'New onboarding live',
    'Realtime dashboard shipped',
    'Zero-downtime deploy',
  ],

  // ---- Interactive draggable pipeline (Attio-style board) ----
  pipeline: {
    title: 'From idea to shipped',
    columns: [
      { id: 'idea', title: 'Idea', accent: '#94a3b8' },
      { id: 'design', title: 'In Design', accent: '#6366f1' },
      { id: 'build', title: 'In Build', accent: '#8b5cf6' },
      { id: 'shipped', title: 'Shipped', accent: '#10b981' },
    ],
    cards: [
      { id: 'onboarding', title: 'Onboarding flow', tag: 'UX · Frontend', column: 'build' },
      { id: 'analytics', title: 'Dashboard analytics', tag: 'Data viz', column: 'shipped' },
      { id: 'mobile', title: 'Mobile app', tag: 'React Native', column: 'design' },
      { id: 'payments', title: 'Payments', tag: 'Integration', column: 'build' },
      { id: 'ai', title: 'AI assistant', tag: 'R&D', column: 'idea' },
      { id: 'settings', title: 'Team settings', tag: 'Settings', column: 'shipped' },
      { id: 'notifications', title: 'Notifications', tag: 'Realtime', column: 'design' },
      { id: 'perf', title: 'Performance audit', tag: 'Lighthouse', column: 'shipped' },
    ],
  },

  // ---- Final CTA ----
  finalCta: {
    headline: "Have an idea for your next digital product?",
    subtitle: "Let's build something exceptional together.",
    button: "Book a Call",
  },

  // ---- Booking modal ("Book a Call") ----
  // Copy + options for the multi-step booking flow. The request is emailed to
  // the owner (via Web3Forms) who confirms by replying — no live calendar sync.
  booking: {
    heading: "Book a call",
    subtitle: "Pick a date and time that suits you — I'll email you to confirm.",
    durationLabel: "30-minute intro call",
    submitLabel: "Request this time",
    successTitle: "Request sent!",
    successBody:
      "Thanks — I've got your email. I'll reply shortly to confirm the time.",
    errorBody:
      "Something went wrong sending your request. You can try again, or reach me directly by email.",
    mailtoRecipient: "mohmmedsaidaker@gmail.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;
