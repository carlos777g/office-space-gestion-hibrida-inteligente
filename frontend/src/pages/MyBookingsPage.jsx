import { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { listMyBookings, cancelBooking } from '../services/bookings.service'
import { apiError } from '../services/http'
import { formatRange } from '../utils/date'

export default function MyBookingsPage() {
  const { state } = useLocation()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(state?.created ? 'Reserva creada con éxito.' : '')
  const [cancelingId, setCancelingId] = useState(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setBookings(await listMyBookings())
    } catch (err) {
      setError(apiError(err, 'No se pudieron cargar tus reservas'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleCancel = async (id) => {
    if (!window.confirm('¿Cancelar esta reserva?')) return
    setCancelingId(id)
    setError('')
    try {
      await cancelBooking(id)
      setNotice('Reserva cancelada.')
      await load()
    } catch (err) {
      setError(apiError(err, 'No se pudo cancelar la reserva'))
    } finally {
      setCancelingId(null)
    }
  }

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Mis reservas</h1>
        <Link
          to="/search"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Nueva reserva
        </Link>
      </div>

      {notice && (
        <div className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {notice}
        </div>
      )}
      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-slate-500">Cargando…</p>
        ) : bookings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-slate-600">Todavía no tienes reservas.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Espacio</th>
                  <th className="px-4 py-3 font-medium">Horario</th>
                  <th className="px-4 py-3 font-medium">Asistentes</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{b.space_name}</p>
                      <p className="text-xs text-slate-500">
                        {b.space_type} · {b.space_floor || 'Sin piso'}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatRange(b.start_time, b.end_time)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{b.attendees}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          b.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {b.status === 'ACTIVE' ? 'Activa' : 'Cancelada'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {b.status === 'ACTIVE' && (
                        <button
                          type="button"
                          onClick={() => handleCancel(b.id)}
                          disabled={cancelingId === b.id}
                          className="cursor-pointer rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                        >
                          {cancelingId === b.id ? 'Cancelando…' : 'Cancelar'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}
