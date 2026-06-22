import { bookingClient } from './http'

// POST booking-service /auth/login -> { token, user }
export async function login(email, password) {
  const { data } = await bookingClient.post('/auth/login', { email, password })
  return data
}
