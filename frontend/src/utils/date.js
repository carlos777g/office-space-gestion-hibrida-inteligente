// Date helpers shared across pages.
// The backend stores TIMESTAMPTZ; we send/receive ISO strings.

// Combine a date input (YYYY-MM-DD) and a time input (HH:mm) into an ISO
// string in the user's local timezone.
export function toISO(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null
  const local = new Date(`${dateStr}T${timeStr}`)
  if (Number.isNaN(local.getTime())) return null
  return local.toISOString()
}

// Today as YYYY-MM-DD (used as min value for date pickers).
export function todayStr() {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

// Human-friendly date + time range, e.g. "22 jun 2026, 09:00 – 10:00".
export function formatRange(startISO, endISO) {
  const start = new Date(startISO)
  const end = new Date(endISO)
  const day = start.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  const t = (d) =>
    d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false })
  return `${day}, ${t(start)} – ${t(end)}`
}

export function formatDateTime(iso) {
  return new Date(iso).toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}
