import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated, isAdmin } from '../utils/auth'

// Guards routes by reading the JWT from localStorage.
// adminOnly routes additionally require the ADMIN role.
export default function ProtectedRoute({ children, adminOnly = false }) {
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/search" replace />
  }

  return children
}
