import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getUser, isAdmin, logout } from '../utils/auth'

export default function Navbar() {
  const navigate = useNavigate()
  const user = getUser()
  const admin = isAdmin()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/search" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white font-bold">
            O
          </span>
          <span className="text-lg font-semibold text-slate-900">OfficeSpace</span>
        </Link>

        <div className="flex items-center gap-1">
          <NavLink to="/search" className={linkClass}>
            Buscar
          </NavLink>
          <NavLink to="/my-bookings" className={linkClass}>
            Mis reservas
          </NavLink>
          {admin && (
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-900">{user?.full_name}</p>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Salir
          </button>
        </div>
      </nav>
    </header>
  )
}
