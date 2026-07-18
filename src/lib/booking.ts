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

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/v1/submit'

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
 * Send the booking via Web3Forms. Requires `hasWeb3FormsKey()` to be true.
 * - Honeypot filled → silently report success without sending (drops bots).
 * - Network/API failure → `{ ok: false, reason: 'error' }` so the caller can
 *   offer the mailto fallback.
 */
export async function submitBooking(payload: BookingPayload): Promise<SubmitResult> {
  // Honeypot tripped — pretend it worked so bots don't know they were dropped.
  if (payload.botcheck && payload.botcheck.trim() !== '') {
    return { ok: true }
  }

  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
  if (!accessKey) {
    return { ok: false, reason: 'no-key' }
  }

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `New booking request — ${payload.email}`,
        from_name: 'Website booking',
        replyto: payload.email,
        botcheck: payload.botcheck ?? '',
        email: payload.email,
        'Preferred date': formatDate(payload.date),
        'Preferred time': payload.time,
        'Timezone (auto)': detectTimezone(),
        Message: payload.message || '—',
      }),
    })
    const data: unknown = await res.json().catch(() => null)
    if (typeof data === 'object' && data !== null && (data as { success?: boolean }).success) {
      return { ok: true }
    }
    return { ok: false, reason: 'error' }
  } catch {
    return { ok: false, reason: 'error' }
  }
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
