import { bookingClient } from './http'

// GET /bookings/my
export async function listMyBookings() {
  const { data } = await bookingClient.get('/bookings/my')
  return data
}

// POST /bookings -> 201 | 400 | 404 | 409
export async function createBooking({ space_id, start_time, end_time, attendees }) {
  const { data } = await bookingClient.post('/bookings', {
    space_id,
    start_time,
    end_time,
    attendees,
  })
  return data
}

// DELETE /bookings/:id
export async function cancelBooking(id) {
  const { data } = await bookingClient.delete(`/bookings/${id}`)
  return data
}
