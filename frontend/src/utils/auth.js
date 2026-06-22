// Lightweight auth state stored in localStorage.
// The JWT is validated server-side by each service; here we only persist it
// and read the user payload returned by the login endpoint.

const TOKEN_KEY = 'officespace_token'
const USER_KEY = 'officespace_user'

export function saveSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function isAuthenticated() {
  return Boolean(getToken())
}

export function isAdmin() {
  const user = getUser()
  return user?.role === 'ADMIN'
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
