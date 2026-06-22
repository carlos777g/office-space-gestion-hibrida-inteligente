import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { getTodayOccupancy } from '../services/dashboard.service'
import {
  listSpaces,
  createSpace,
  updateSpace,
  deleteSpace,
} from '../services/spaces.service'
import { apiError } from '../services/http'

const EMPTY_FORM = {
  name: '',
  type: 'SALA',
  capacity: 1,
  floor: '',
  has_projector: false,
  has_ac: false,
}

export default function AdminPage() {
  const [dashboard, setDashboard] = useState(null)
  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | space object
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [dash, sp] = await Promise.all([getTodayOccupancy(), listSpaces()])
      setDashboard(dash)
      setSpaces(sp)
    } catch (err) {
      setError(apiError(err, 'No se pudo cargar el panel'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openNew = () => {
    setForm(EMPTY_FORM)
    setEditing('new')
  }

  const openEdit = (space) => {
    setForm({
      name: space.name,
      type: space.type,
      capacity: space.capacity,
      floor: space.floor || '',
      has_projector: space.has_projector,
      has_ac: space.has_ac,
    })
    setEditing(space)
  }

  const closeForm = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, capacity: Number(form.capacity) }
      if (editing === 'new') {
        await createSpace(payload)
      } else {
        await updateSpace(editing.id, payload)
      }
      closeForm()
      await load()
    } catch (err) {
      setError(apiError(err, 'No se pudo guardar el espacio'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (space) => {
    if (!window.confirm(`¿Eliminar "${space.name}"?`)) return
    setError('')
    try {
      await deleteSpace(space.id)
      await load()
    } catch (err) {
      setError(apiError(err, 'No se pudo eliminar el espacio'))
    }
  }

  const setField = (key) => (e) => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [key]: value }))
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-slate-900">Panel de administración</h1>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-slate-500">Cargando…</p>
      ) : (
        <>
          {/* Occupancy summary */}
          <section className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Ocupación de hoy
            </h2>
            <div className="mt-3 grid grid-cols-3 gap-4">
              <Stat label="Total" value={dashboard?.summary.total ?? 0} tone="slate" />
              <Stat label="Ocupados ahora" value={dashboard?.summary.occupied ?? 0} tone="indigo" />
              <Stat label="Libres" value={dashboard?.summary.free ?? 0} tone="emerald" />
            </div>

            {/* Per-space occupancy: quick view of who/what is busy today */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(dashboard?.spaces ?? []).map((s) => (
                <div
                  key={s.id}
                  className={`flex items-center justify-between rounded-lg border p-3 ${
                    s.is_occupied_now
                      ? 'border-indigo-200 bg-indigo-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">{s.name}</p>
                    <p className="text-xs text-slate-500">
                      {s.type} · {s.floor || 'Sin piso'} · {s.booking_count} reserva
                      {Number(s.booking_count) === 1 ? '' : 's'} hoy
                    </p>
                  </div>
                  <span
                    className={`ml-3 shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                      s.is_occupied_now
                        ? 'bg-indigo-600 text-white'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {s.is_occupied_now ? 'Ocupado' : 'Libre'}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Spaces management */}
          <section className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Espacios
              </h2>
              <button
                type="button"
                onClick={openNew}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Nuevo espacio
              </button>
            </div>

            <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Nombre</th>
                    <th className="px-4 py-3 font-medium">Tipo</th>
                    <th className="px-4 py-3 font-medium">Cap.</th>
                    <th className="px-4 py-3 font-medium">Piso</th>
                    <th className="px-4 py-3 font-medium">Equip.</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {spaces.map((s) => (
                    <tr key={s.id}>
                      <td className="px-4 py-3 font-medium text-slate-900">{s.name}</td>
                      <td className="px-4 py-3 text-slate-700">{s.type}</td>
                      <td className="px-4 py-3 text-slate-700">{s.capacity}</td>
                      <td className="px-4 py-3 text-slate-700">{s.floor || '—'}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {[s.has_projector && 'Proyector', s.has_ac && 'A/C']
                          .filter(Boolean)
                          .join(', ') || '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(s)}
                            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(s)}
                            className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* Create / edit modal */}
      {editing && (
        <div className="fixed inset-0 z-10 grid place-items-center bg-black/40 p-4">
          <form
            onSubmit={handleSave}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {editing === 'new' ? 'Nuevo espacio' : 'Editar espacio'}
            </h3>

            <div className="mt-4 space-y-4">
              <Field label="Nombre">
                <input
                  required
                  value={form.name}
                  onChange={setField('name')}
                  className={inputClass}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Tipo">
                  <select value={form.type} onChange={setField('type')} className={inputClass}>
                    <option value="SALA">Sala</option>
                    <option value="DESK">Escritorio</option>
                  </select>
                </Field>
                <Field label="Capacidad">
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.capacity}
                    onChange={setField('capacity')}
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Piso">
                <input value={form.floor} onChange={setField('floor')} className={inputClass} />
              </Field>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.has_projector}
                    onChange={setField('has_projector')}
                  />
                  Proyector
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={form.has_ac} onChange={setField('has_ac')} />
                  Aire acondicionado
                </label>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={closeForm}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {saving ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      )}
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

function Stat({ label, value, tone }) {
  const tones = {
    slate: 'text-slate-900',
    indigo: 'text-indigo-600',
    emerald: 'text-emerald-600',
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${tones[tone]}`}>{value}</p>
    </div>
  )
}
