import { useState, type FormEvent, type ReactNode } from 'react'
import { siteConfig } from '../../config/site'
import { useLocale } from '../../i18n/LocaleProvider'
import { Section } from '../ui/Section'
import { Reveal } from '../ui/Reveal'
import { BookCallButton } from '../booking/BookCallButton'
import { submitContact } from '../../lib/booking'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const FIELD =
  'mt-1.5 w-full rounded-xl border border-line bg-canvas-subtle px-3.5 py-3 text-sm text-ink placeholder:text-subtle focus:border-accent focus:bg-canvas focus:outline-none'
const PRIMARY_BTN =
  'group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-canvas transition-all duration-200 hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60'

type Status = 'idle' | 'submitting' | 'success'

export function Contact() {
  const { t, locale } = useLocale()
  const { social, email, name, nameAr } = siteConfig
  const copy = t.contact
  const displayName = locale === 'ar' ? nameAr : name
  const role = t.seo.jobTitle
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  const [contactName, setContactName] = useState('')
  const [emailVal, setEmailVal] = useState('')
  const [message, setMessage] = useState('')
  const [botcheck, setBotcheck] = useState('')

  function reset() {
    setContactName('')
    setEmailVal('')
    setMessage('')
    setBotcheck('')
    setStatus('idle')
    setError('')
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (botcheck.trim()) {
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
    if (message.trim().length < 4) {
      setError(copy.errMessage)
      return
    }

    setStatus('submitting')
    try {
      const res = await submitContact(
        { name: contactName.trim(), email: emailVal.trim(), message: message.trim(), botcheck },
        email,
      )
      if (res.ok) {
        setStatus('success')
        return
      }
    } catch {
      /* network / abort */
    }
    setStatus('idle')
    setError(copy.errorBody)
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
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted">{copy.successBody}</p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <BookCallButton variant="primary">{copy.book}</BookCallButton>
              <button
                type="button"
                onClick={reset}
                className="cursor-pointer text-sm font-medium text-muted hover:text-ink"
              >
                {copy.another}
              </button>
            </div>
          </div>
        </Reveal>
      </Section>
    )
  }

  return (
    <Section id="contact" subtle>
      <Reveal>
        <div className="overflow-hidden rounded-3xl border border-line bg-canvas shadow-[0_30px_80px_-50px_rgba(17,17,22,0.3)] lg:grid lg:grid-cols-2">
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

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="text-sm text-subtle">{copy.preferTalk}</span>
                <BookCallButton variant="primary" size="sm">
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
                <a href={social.telegram} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
                  Telegram
                </a>
                <a
                  href={siteConfig.cv}
                  download="Mohammed_Said_FullStack_Developer.pdf"
                  className="transition-colors hover:text-ink"
                >
                  {copy.cv}
                </a>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10 lg:p-12">
            <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={botcheck}
                onChange={(e) => setBotcheck(e.target.value)}
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

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
              <Field id="ct-message" label={copy.message} required>
                <textarea
                  id="ct-message"
                  className={`${FIELD} resize-none`}
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={copy.messagePlaceholder}
                />
              </Field>

              {error && (
                <p className="text-sm text-rose-400">
                  {error}
                  {error === copy.errorBody && (
                    <>
                      {' '}
                      <a href={`mailto:${email}`} className="font-medium underline hover:text-ink">
                        {email}
                      </a>
                    </>
                  )}
                </p>
              )}

              <button type="submit" disabled={status === 'submitting'} className={`${PRIMARY_BTN} w-full`}>
                {status === 'submitting' ? copy.sending : copy.submit}
              </button>
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
  children,
}: {
  id: string
  label: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      {children}
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
