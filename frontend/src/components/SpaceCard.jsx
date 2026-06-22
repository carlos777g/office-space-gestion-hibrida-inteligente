// Presentational card for a space in the search results.
export default function SpaceCard({ space, onSelect }) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{space.name}</h3>
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

      <dl className="mt-4 space-y-1 text-sm text-slate-600">
        <div className="flex justify-between">
          <dt>Capacidad</dt>
          <dd className="font-medium text-slate-900">{space.capacity}</dd>
        </div>
        <div className="flex gap-2 pt-1">
          {space.has_projector && (
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs">Proyector</span>
          )}
          {space.has_ac && (
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs">A/C</span>
          )}
        </div>
      </dl>

      <button
        type="button"
        onClick={() => onSelect(space)}
        className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Reservar
      </button>
    </div>
  )
}
