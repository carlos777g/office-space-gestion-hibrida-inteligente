import { catalogClient } from './http'

// GET /dashboard/today (ADMIN) -> { summary, spaces }
export async function getTodayOccupancy() {
  const { data } = await catalogClient.get('/dashboard/today')
  return data
}
