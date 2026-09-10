import { useState, type FormEvent, type ReactNode } from 'react'
import { siteConfig } from '../../config/site'
import { useLocale } from '../../i18n/LocaleProvider'
import { Section } from '../ui/Section'
import { Reveal } from '../ui/Reveal'
import { BookCallButton } from '../booking/BookCallButton'
import { hasWeb3FormsKey } from '../../lib/booking'

/**
 * Contact — a two-column project-inquiry form, the alternative path for visitors
 * who'd rather share details than book a call. Submission reuses the same
 * Web3Forms backend as the booking flow (env key + mailto fallback + honeypot),
 * so every inquiry lands in the owner's inbox the same way.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ENDPOINT = 'https://api.web3forms.com/v1/submit'

const FIELD =
  'mt-1.5 w-full rounded-xl border border-line bg-canvas-subtle px-3.5 py-3 text-sm text-ink placeholder:text-subtle focus:border-accent focus:bg-canvas focus:outline-none'
const PRIMARY_BTN =
  'group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-canvas transition-all duration-200 hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60'

type Status = 'idle' | 'submitting' | 'success'

export function Contact() {
  const { t, locale } = useLocale()
  const { contact, social, email, name, nameAr } = siteConfig
  const copy = t.contact
  const displayName = locale === 'ar' ? nameAr : name
  const role = t.seo.jobTitle
  const [status, setStatus] = useState<Status>('idle')
  const [deliveredVia, setDeliveredVia] = useState<'email' | 'mailto'>('email')
  const [error, setError] = useState('')

  const [contactName, setContactName] = useState('')
  const [emailVal, setEmailVal] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [details, setDetails] = useState('')
  const [budget, setBudget] = useState('')
  const [botcheck, setBotcheck] = useState('') // honeypot — must stay empty

  function reset() {
    setContactName('')
    setEmailVal('')
    setWhatsapp('')
    setDetails('')
    setBudget('')
    setBotcheck('')
    setStatus('idle')
    setError('')
  }

  function buildMailto() {
    const subject = `Project inquiry — ${contactName || 'website'}`
    const body = [
      `Name: ${contactName}`,
      `Email: ${emailVal}`,
      whatsapp ? `WhatsApp: ${whatsapp}` : '',
      budget ? `Budget: ${budget}` : '',
      '',
      details,
    ]
      .filter(Boolean)
      .join('\n')
    return `mailto:${email}?${new URLSearchParams({ subject, body }).toString()}`
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    // Honeypot tripped → silently pretend success (drops bots).
    if (botcheck.trim()) {
      setDeliveredVia('email')
      setStatus('success')
      return
    }
    if (!contactName.trim()) {
      setError(copy.errName)
      return
    }
    if (!EMAIL_RE.test(emailVal)) {
      setError(copy.errEmail)
      return
    }
    if (details.trim().length < 10) {
      setError(copy.errDetails)
      return
    }

    const key = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
    if (!key) {
      // No backend key → fall back to a pre-filled email.
      window.location.href = buildMailto()
      setDeliveredVia('mailto')
      setStatus('success')
      return
    }

    setStatus('submitting')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: key,
          subject: `New project inquiry — ${contactName}`,
          from_name: 'Website contact',
          replyto: emailVal,
          botcheck,
          email: emailVal,
          Name: contactName,
          Email: emailVal,
          WhatsApp: whatsapp || '—',
          Budget: budget || 'Not specified',
          'Project details': details,
        }),
      })
      const data: unknown = await res.json().catch(() => null)
      if (typeof data === 'object' && data !== null && (data as { success?: boolean }).success) {
        setDeliveredVia('email')
        setStatus('success')
        return
      }
      setStatus('idle')
      setError(copy.errorBody)
    } catch {
      setStatus('idle')
      setError(copy.errorBody)
    }
  }

  if (status === 'success') {
    return (
      <Section id="contact" subtle>
        <Reveal>
          <div className="mx-auto max-w-xl rounded-3xl border border-line bg-canvas px-6 py-16 text-center shadow-[0_30px_80px_-50px_rgba(17,17,22,0.3)] sm:px-12">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent-soft">
              <CheckIcon />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-ink">{copy.successTitle}</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
              {deliveredVia === 'mailto' ? copy.mailtoHint : copy.successBody}
            </p>
            {deliveredVia === 'mailto' && (
              <a className={`${PRIMARY_BTN} mt-6`} href={buildMailto()}>
                {copy.openEmail}
              </a>
            )}
            <button
              type="button"
              onClick={reset}
              className="mt-4 block w-full cursor-pointer text-sm font-medium text-accent hover:underline"
            >
              {copy.another}
            </button>
          </div>
        </Reveal>
      </Section>
    )
  }

  return (
    <Section id="contact" subtle>
      <Reveal>
        <div className="overflow-hidden rounded-3xl border border-line bg-canvas shadow-[0_30px_80px_-50px_rgba(17,17,22,0.3)] lg:grid lg:grid-cols-2">
          {/* Left — info / reassurance */}
          <div className="relative flex flex-col justify-between gap-10 bg-canvas-subtle p-8 sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute -start-10 top-10 h-44 w-44 rounded-full bg-accent/10 blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 text-sm font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="text-accent">{copy.eyebrow}</span>
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {copy.headline}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">
                {copy.body}
              </p>
            </div>

            <div className="relative flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-sm font-semibold text-white">
                  MS
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{displayName}</p>
                  <p className="text-xs text-muted">{role}</p>
                </div>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1.5 text-xs font-medium text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {copy.responseTime}
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                <span className="text-subtle">{copy.preferTalk}</span>
                <BookCallButton variant="secondary" size="sm">
                  {copy.book}
                </BookCallButton>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                <a href={`mailto:${email}`} className="transition-colors hover:text-ink">
                  {email}
                </a>
                <a href={social.upwork} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
                  Upwork
                </a>
                <a href={social.linkedin} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Right — the form */}
          <div className="p-8 sm:p-10 lg:p-12">
            <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
              {/* Honeypot — visually hidden, real users never see it. */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={botcheck}
                onChange={(e) => setBotcheck(e.target.value)}
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field id="ct-name" label={copy.name} required>
                  <input
                    id="ct-name"
                    className={FIELD}
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder={copy.namePlaceholder}
                    autoComplete="name"
                  />
                </Field>
                <Field id="ct-email" label={copy.email} required>
                  <input
                    id="ct-email"
                    className={FIELD}
                    type="email"
                    value={emailVal}
                    onChange={(e) => setEmailVal(e.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </Field>
              </div>

              <Field id="ct-whatsapp" label={copy.whatsapp} optional optionalLabel={copy.optional}>
                <input
                  id="ct-whatsapp"
                  className={FIELD}
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+1 234 567 890"
                  inputMode="tel"
                />
              </Field>

              <Field id="ct-details" label={copy.details} required hint={copy.detailsHint}>
                <textarea
                  id="ct-details"
                  className={`${FIELD} resize-none`}
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={copy.detailsPlaceholder}
                />
              </Field>

              <div>
                <p className="text-sm font-medium text-ink">{copy.budget}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {contact.budgets.map((b) => (
                    <button
                      type="button"
                      key={b}
                      onClick={() => setBudget((prev) => (prev === b ? '' : b))}
                      aria-pressed={budget === b}
                      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                        budget === b
                          ? 'border-transparent bg-accent text-white'
                          : 'border-line bg-canvas text-muted hover:text-ink'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-sm text-rose-400">{error}</p>}

              <button type="submit" disabled={status === 'submitting'} className={`${PRIMARY_BTN} w-full`}>
                {status === 'submitting' ? copy.sending : copy.submit}
              </button>

              {!hasWeb3FormsKey() && (
                <p className="text-center text-xs text-subtle">{copy.mailtoHint}</p>
              )}
            </form>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}

function Field({
  id,
  label,
  required,
  optional,
  hint,
  optionalLabel,
  children,
}: {
  id: string
  label: string
  required?: boolean
  optional?: boolean
  hint?: string
  optionalLabel?: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required && <span className="text-accent"> *</span>}
        {optional && <span className="text-subtle"> ({optionalLabel})</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-subtle">{hint}</p>}
    </div>
  )
}

function CheckIcon() {
  return (
    <svg className="h-6 w-6 text-accent" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5 10.5l3.2 3.2L15 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
