import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import SpaceCard from '../components/SpaceCard'
import { listAvailableSpaces } from '../services/spaces.service'
import { apiError } from '../services/http'
import { toISO, todayStr } from '../utils/date'

export default function SearchPage() {
  const navigate = useNavigate()
  const today = todayStr()

  const [filters, setFilters] = useState({
    date: today,
    start: '09:00',
    end: '10:00',
    type: '',
    min_capacity: '',
  })
  const [spaces, setSpaces] = useState([])
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (key) => (e) =>
    setFilters((f) => ({ ...f, [key]: e.target.value }))

  const handleSearch = async (e) => {
    e.preventDefault()
    setError('')

    const start_time = toISO(filters.date, filters.start)
    const end_time = toISO(filters.date, filters.end)

    if (!start_time || !end_time) {
      setError('Selecciona fecha y horario válidos')
      return
    }
    if (new Date(end_time) <= new Date(start_time)) {
      setError('La hora de fin debe ser posterior a la de inicio')
      return
    }

    setLoading(true)
    try {
      const data = await listAvailableSpaces({
        start_time,
        end_time,
        type: filters.type,
        min_capacity: filters.min_capacity,
      })
      setSpaces(data)
      setSearched(true)
    } catch (err) {
      setError(apiError(err, 'No se pudieron cargar los espacios'))
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (space) => {
    // Carry the chosen slot to the confirmation page via router state.
    navigate('/confirm', {
      state: {
        space,
        start_time: toISO(filters.date, filters.start),
        end_time: toISO(filters.date, filters.end),
      },
    })
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-slate-900">Buscar espacios disponibles</h1>
      <p className="mt-1 text-sm text-slate-500">
        Elige un horario y filtra por tipo o capacidad.
      </p>

      <form
        onSubmit={handleSearch}
        className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-6"
      >
        <Field label="Fecha">
          <input
            type="date"
            min={today}
            value={filters.date}
            onChange={update('date')}
            className={inputClass}
          />
        </Field>
        <Field label="Inicio">
          <input type="time" value={filters.start} onChange={update('start')} className={inputClass} />
        </Field>
        <Field label="Fin">
          <input type="time" value={filters.end} onChange={update('end')} className={inputClass} />
        </Field>
        <Field label="Tipo">
          <select value={filters.type} onChange={update('type')} className={inputClass}>
            <option value="">Todos</option>
            <option value="SALA">Sala</option>
            <option value="DESK">Escritorio</option>
          </select>
        </Field>
        <Field label="Capacidad mín.">
          <input
            type="number"
            min="1"
            value={filters.min_capacity}
            onChange={update('min_capacity')}
            placeholder="Cualquiera"
            className={inputClass}
          />
        </Field>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? 'Buscando…' : 'Buscar'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-slate-500">Cargando…</p>
        ) : searched && spaces.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-slate-600">
              No hay espacios disponibles para ese horario.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {spaces.map((space) => (
              <SpaceCard key={space.id} space={space} onSelect={handleSelect} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  )
}
