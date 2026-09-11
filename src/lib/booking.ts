/**
 * Booking logic for the "Book a Call" flow.
 *
 * Delivery: posts to Web3Forms (no backend) when an access key is present, and
 * falls back to a pre-filled mailto: otherwise so the site is never broken.
 * Mirrors the separation pattern used by `lib/pagespeed.ts`.
 *
 * The client only picks date + time + email. The visitor's timezone is
 * auto-detected and included in the message to the owner (so they can confirm
 * the exact timezone over email) without burdening the client with a picker.
 */

export type BookingPayload = {
  /** ISO date string (yyyy-mm-dd) from the native date input. */
  date: string
  /** 24h time (HH:MM) from the native time input. */
  time: string
  email: string
  message?: string
  /** Honeypot — must stay empty. A non-empty value means a bot filled it. */
  botcheck?: string
}

export type SubmitResult = { ok: true } | { ok: false; reason: 'no-key' | 'error' }

function isSuccess(data: unknown): boolean {
  if (typeof data !== 'object' || data === null) return false
  const success = (data as { success?: boolean | string }).success
  return success === true || success === 'true'
}

function responseMessage(data: unknown): string {
  if (typeof data !== 'object' || data === null) return ''
  return String((data as { message?: string }).message ?? '')
}

function isFormSubmitAccepted(data: unknown): boolean {
  if (isSuccess(data)) return true
  return /activat|confirm|submitted successfully/i.test(responseMessage(data))
}

function needsPageReferrer(data: unknown): boolean {
  return /html files|web server/i.test(responseMessage(data))
}

async function readJson(res: Response): Promise<unknown> {
  const text = await res.text()
  try {
    return JSON.parse(text) as unknown
  } catch {
    return { message: text }
  }
}

function abortIn(ms: number): AbortSignal {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
    return AbortSignal.timeout(ms)
  }
  const ctrl = new AbortController()
  setTimeout(() => ctrl.abort(), ms)
  return ctrl.signal
}

/** Native form POST — sends a document Referer, which FormSubmit requires. */
function postFormSubmitFrame(recipient: string, body: Record<string, string>): Promise<SubmitResult> {
  if (typeof document === 'undefined') return Promise.resolve({ ok: false, reason: 'error' })
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe')
    const name = `fs_${Date.now()}`
    iframe.name = name
    iframe.setAttribute('aria-hidden', 'true')
    iframe.style.cssText = 'position:absolute;width:0;height:0;border:0;overflow:hidden'
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = `https://formsubmit.co/${encodeURIComponent(recipient)}`
    form.target = name
    form.acceptCharset = 'UTF-8'
    form.style.display = 'none'
    for (const [key, value] of Object.entries(body)) {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = key
      input.value = value
      form.appendChild(input)
    }
    document.body.append(iframe, form)
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      iframe.remove()
      form.remove()
      resolve({ ok: true })
    }
    form.submit()
    setTimeout(finish, 1800)
  })
}

async function postFormSubmit(
  recipient: string,
  body: Record<string, string>,
): Promise<SubmitResult> {
  if (!recipient) return { ok: false, reason: 'no-key' }
  const fields = { ...body, _template: 'table' }
  try {
    const fd = new FormData()
    for (const [key, value] of Object.entries(fields)) fd.append(key, value)

    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      referrerPolicy: 'origin',
      body: fd,
      signal: abortIn(15000),
    })
    const data = await readJson(res)
    if (isFormSubmitAccepted(data)) return { ok: true }
    if (needsPageReferrer(data)) return postFormSubmitFrame(recipient, fields)
    return { ok: false, reason: 'error' }
  } catch {
    return postFormSubmitFrame(recipient, fields)
  }
}

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'

/** True when a Web3Forms access key is configured in the environment. */
export function hasWeb3FormsKey(): boolean {
  return Boolean(import.meta.env.VITE_WEB3FORMS_ACCESS_KEY)
}

/** Best-effort IANA timezone for the visitor's browser. */
export function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

/** Today's date as an ISO yyyy-mm-dd string (local time), for `min` on the date input. */
export function todayISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Current local time as HH:MM, for `min` on the time input when the date is today. */
export function nowHHMM(): string {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/** Human-readable date label, e.g. "Thu, Jul 17, 2025". Falls back to the raw string. */
export function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Send the booking via Web3Forms when a key is set, otherwise FormSubmit.
 */
export async function submitBooking(
  payload: BookingPayload,
  recipient: string,
): Promise<SubmitResult> {
  if (payload.botcheck && payload.botcheck.trim() !== '') {
    return { ok: true }
  }

  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
  const fields = {
    email: payload.email,
    'Preferred date': formatDate(payload.date),
    'Preferred time': payload.time,
    'Timezone (auto)': detectTimezone(),
    Message: payload.message || '—',
  }

  if (accessKey) {
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        referrerPolicy: 'origin',
        body: JSON.stringify({
          access_key: accessKey,
          subject: `New booking request — ${payload.email}`,
          from_name: 'Website booking',
          replyto: payload.email,
          botcheck: payload.botcheck ?? '',
          ...fields,
        }),
        signal: abortIn(15000),
      })
      const data: unknown = await res.json().catch(() => null)
      if (isSuccess(data)) return { ok: true }
      return { ok: false, reason: 'error' }
    } catch {
      return { ok: false, reason: 'error' }
    }
  }

  return postFormSubmit(recipient, {
    ...fields,
    _subject: `New booking request — ${payload.email}`,
    _captcha: 'false',
    _replyto: payload.email,
  })
}

export type ContactPayload = {
  name: string
  email: string
  message: string
  botcheck?: string
}

/** Send a contact message. Web3Forms when a key is set; otherwise FormSubmit. */
export async function submitContact(
  payload: ContactPayload,
  recipient: string,
): Promise<SubmitResult> {
  if (payload.botcheck && payload.botcheck.trim() !== '') {
    return { ok: true }
  }

  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
  if (accessKey) {
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        referrerPolicy: 'origin',
        body: JSON.stringify({
          access_key: accessKey,
          subject: `New message — ${payload.name}`,
          from_name: 'Website contact',
          replyto: payload.email,
          botcheck: payload.botcheck ?? '',
          email: payload.email,
          Name: payload.name,
          Message: payload.message,
        }),
        signal: abortIn(15000),
      })
      const data: unknown = await res.json().catch(() => null)
      if (isSuccess(data)) return { ok: true }
      return { ok: false, reason: 'error' }
    } catch {
      return { ok: false, reason: 'error' }
    }
  }

  return postFormSubmit(recipient, {
    name: payload.name,
    email: payload.email,
    message: payload.message,
    _subject: `New message — ${payload.name}`,
    _captcha: 'false',
    _replyto: payload.email,
  })
}

/** Compose a pre-filled mailto: link as a fallback / "prefer email" option. */
export function buildMailto(payload: BookingPayload, recipient: string): string {
  const subject = `Booking request — ${formatDate(payload.date)} at ${payload.time}`
  const lines = [
    'Hi,',
    '',
    "I'd like to book a call.",
    '',
    `Preferred date: ${formatDate(payload.date)}`,
    `Preferred time: ${payload.time}`,
    `My timezone: ${detectTimezone()}`,
    '',
    payload.message ?? '',
    '',
    payload.email,
  ]
  const params = new URLSearchParams({
    subject,
    body: lines.join('\n'),
  })
  return `mailto:${recipient}?${params.toString()}`
}
