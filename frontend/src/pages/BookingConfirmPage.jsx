import { useState } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { createBooking } from '../services/bookings.service'
import { apiError } from '../services/http'
import { formatRange } from '../utils/date'

export default function BookingConfirmPage() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const [attendees, setAttendees] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Reached without a selected space (e.g. direct URL) -> back to search.
  if (!state?.space || !state?.start_time || !state?.end_time) {
    return <Navigate to="/search" replace />
  }

  const { space, start_time, end_time } = state

  const handleConfirm = async () => {
    setError('')

    if (Number(attendees) < 1) {
      setError('Debe haber al menos 1 asistente')
      return
    }
    if (Number(attendees) > space.capacity) {
      setError(`La capacidad del espacio es ${space.capacity}`)
      return
    }

    setLoading(true)
    try {
      await createBooking({
        space_id: space.id,
        start_time,
        end_time,
        attendees: Number(attendees),
      })
      navigate('/my-bookings', { replace: true, state: { created: true } })
    } catch (err) {
      const status = err.response?.status
      if (status === 409) {
        setError('Ese horario ya fue reservado por alguien más. Elige otro.')
      } else {
        setError(apiError(err, 'No se pudo crear la reserva'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-lg">
        <h1 className="text-2xl font-bold text-slate-900">Confirmar reserva</h1>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{space.name}</h2>
              <p className="text-sm text-slate-500">{space.floor || 'Sin piso'}</p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                space.type === 'SALA'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              {space.type}
            </span>
          </div>

          <dl className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
            <Row label="Horario" value={formatRange(start_time, end_time)} />
            <Row label="Capacidad máxima" value={space.capacity} />
          </dl>

          <div className="mt-5">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Número de asistentes
            </label>
            <input
              type="number"
              min="1"
              max={space.capacity}
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Volver
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? 'Reservando…' : 'Confirmar reserva'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-900">{value}</dd>
    </div>
  )
}
