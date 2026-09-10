import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { siteConfig } from '../../config/site'
import { useLocale } from '../../i18n/LocaleProvider'
import {
  buildMailto,
  formatDate,
  hasWeb3FormsKey,
  nowHHMM,
  submitBooking,
  todayISO,
  type BookingPayload,
} from '../../lib/booking'

type Status = 'idle' | 'submitting' | 'success'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const PRIMARY_BTN =
  'group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-canvas transition-all duration-200 hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60'
const QUIET_BTN =
  'inline-flex cursor-pointer items-center justify-center rounded-full border border-line bg-canvas px-5 py-3 text-sm font-semibold text-muted transition hover:bg-canvas-subtle hover:text-ink'
const FIELD =
  'mt-1.5 w-full rounded-xl border border-line bg-canvas-subtle px-3.5 py-3 text-sm text-ink placeholder:text-subtle focus:border-accent focus:bg-canvas focus:outline-none'

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const { booking } = siteConfig
  const { t: dict } = useLocale()
  const copy = dict.booking
  const reduce = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)

  const [status, setStatus] = useState<Status>('idle')
  const [deliveredVia, setDeliveredVia] = useState<'email' | 'mailto'>('email')
  const [error, setError] = useState('')

  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [botcheck, setBotcheck] = useState('') // honeypot — must stay empty

  // Reset the form every time the modal opens.
  useEffect(() => {
    if (!isOpen) return
    setStatus('idle')
    setDeliveredVia('email')
    setError('')
    setDate('')
    setTime('')
    setEmail('')
    setMessage('')
    setBotcheck('')
  }, [isOpen])

  // Esc to close, lock body scroll, move focus into the dialog.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => panelRef.current?.focus(), 0)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      window.clearTimeout(t)
    }
  }, [isOpen, onClose])

  function buildPayload(): BookingPayload {
    return { date, time, email, message, botcheck }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!date) {
      setError(copy.errDate)
      return
    }
    if (!time) {
      setError(copy.errTime)
      return
    }
    // Block past times when the chosen date is today (zero-padded HH:MM compares correctly).
    if (date === todayISO() && time < nowHHMM()) {
      setError(copy.errPast)
      return
    }
    if (!EMAIL_RE.test(email)) {
      setError(copy.errEmail)
      return
    }

    const payload = buildPayload()

    if (hasWeb3FormsKey()) {
      setStatus('submitting')
      const res = await submitBooking(payload)
      if (res.ok) {
        setDeliveredVia('email')
        setStatus('success')
        return
      }
      setStatus('idle')
      setError(copy.errorBody)
      return
    }

    // No access key configured → fall back to a pre-filled email.
    window.location.href = buildMailto(payload, booking.mailtoRecipient)
    setDeliveredVia('mailto')
    setStatus('success')
  }

  // Past times are only blocked when the date is today.
  const timeMin = date === todayISO() ? nowHHMM() : undefined

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.98 }}
            transition={{ duration: reduce ? 0 : 0.32, ease: EASE }}
            className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-line bg-canvas p-6 shadow-2xl outline-none sm:rounded-3xl sm:p-8"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={copy.close}
              className="absolute end-4 top-4 grid h-9 w-9 cursor-pointer place-items-center rounded-full text-subtle transition hover:bg-canvas-subtle hover:text-ink"
            >
              <XIcon />
            </button>

            {status === 'success' ? (
              <div className="text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent-soft">
                  <CheckIcon />
                </div>
                <h2 className="mt-5 text-2xl font-semibold text-ink">{copy.successTitle}</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                  {deliveredVia === 'mailto' ? copy.mailtoBody : copy.successBody}
                </p>

                <dl className="mx-auto mt-6 max-w-sm space-y-2 rounded-2xl border border-line bg-canvas-subtle p-5 text-start text-sm">
                  <Row k={copy.date} v={formatDate(date)} />
                  <Row k={copy.time} v={time} />
                  <Row k={copy.email} v={email} />
                </dl>

                <div className="mt-6 flex flex-col items-center gap-3">
                  {deliveredVia === 'mailto' && (
                    <a
                      className={PRIMARY_BTN}
                      href={buildMailto(buildPayload(), booking.mailtoRecipient)}
                    >
                      {copy.openEmail}
                    </a>
                  )}
                  <button type="button" className={QUIET_BTN} onClick={onClose}>
                    {copy.done}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <header>
                  <h2 id="booking-title" className="text-xl font-semibold text-ink sm:text-2xl">
                    {copy.heading}
                  </h2>
                  <p className="mt-1 text-sm text-muted">{copy.subtitle}</p>
                </header>

                <form onSubmit={onSubmit} className="mt-5">
                  {/* Honeypot for spam bots — visually hidden, real users never see it. */}
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
                    <div>
                      <label htmlFor="bk-date" className="text-sm font-medium text-ink">
                        {copy.date}
                      </label>
                      <input
                        id="bk-date"
                        type="date"
                        min={todayISO()}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={FIELD}
                      />
                    </div>
                    <div>
                      <label htmlFor="bk-time" className="text-sm font-medium text-ink">
                        {copy.time}
                      </label>
                      <input
                        id="bk-time"
                        type="time"
                        min={timeMin}
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className={FIELD}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="bk-email" className="text-sm font-medium text-ink">
                      {copy.email} <span className="text-accent">*</span>
                    </label>
                    <input
                      id="bk-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className={FIELD}
                    />
                  </div>

                  <div className="mt-4">
                    <label htmlFor="bk-message" className="text-sm font-medium text-ink">
                      {copy.message} <span className="text-subtle">({dict.contact.optional})</span>
                    </label>
                    <textarea
                      id="bk-message"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={copy.messagePlaceholder}
                      className={`${FIELD} resize-none`}
                    />
                  </div>

                  {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className={`${PRIMARY_BTN} mt-5 w-full`}
                  >
                    {status === 'submitting' ? copy.sending : copy.submit}
                  </button>

                  <p className="mt-3 text-center text-xs text-subtle">
                    {copy.preferUpwork}{' '}
                    <a
                      href={siteConfig.social.upwork}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
                    >
                      {copy.hireUpwork}
                      <ExternalIcon />
                    </a>
                  </p>

                  {!hasWeb3FormsKey() && (
                    <p className="mt-2 text-center text-xs text-subtle">{copy.mailtoHint}</p>
                  )}
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-subtle">{k}</dt>
      <dd className="text-end font-medium text-ink">{v}</dd>
    </div>
  )
}

function XIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
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

function ExternalIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6 3h7v7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 3L6 10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
