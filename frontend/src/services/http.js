import axios from 'axios'
import { getToken, logout } from '../utils/auth'

// Two backends share the same auth scheme, so we build a configured axios
// instance per base URL and attach the JWT on every request.
function createClient(baseURL) {
  const client = axios.create({ baseURL })

  client.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  client.interceptors.response.use(
    (res) => res,
    (error) => {
      // Token expired or invalid -> clear session and bounce to login.
      if (error.response?.status === 401) {
        logout()
        if (window.location.pathname !== '/') {
          window.location.assign('/')
        }
      }
      return Promise.reject(error)
    }
  )

  return client
}

export const catalogClient = createClient(import.meta.env.VITE_CATALOG_API_URL)
export const bookingClient = createClient(import.meta.env.VITE_BOOKING_API_URL)

// Normalize an axios error into a readable message for the UI.
export function apiError(error, fallback = 'Ocurrió un error inesperado') {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    fallback
  )
}
