import { catalogClient } from './http'

// GET /spaces?type=&min_capacity=
export async function listSpaces(params = {}) {
  const { data } = await catalogClient.get('/spaces', { params: clean(params) })
  return data
}

// GET /spaces/availability?start_time=&end_time=&type=&min_capacity=
export async function listAvailableSpaces(params) {
  const { data } = await catalogClient.get('/spaces/availability', {
    params: clean(params),
  })
  return data
}

// GET /spaces/:id
export async function getSpace(id) {
  const { data } = await catalogClient.get(`/spaces/${id}`)
  return data
}

// POST /spaces (ADMIN)
export async function createSpace(payload) {
  const { data } = await catalogClient.post('/spaces', payload)
  return data
}

// PUT /spaces/:id (ADMIN)
export async function updateSpace(id, payload) {
  const { data } = await catalogClient.put(`/spaces/${id}`, payload)
  return data
}

// DELETE /spaces/:id (ADMIN)
export async function deleteSpace(id) {
  const { data } = await catalogClient.delete(`/spaces/${id}`)
  return data
}

// Drop empty/undefined query params so we don't send "?type=".
function clean(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== '' && v !== undefined && v !== null)
  )
}
