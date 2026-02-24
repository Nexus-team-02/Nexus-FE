import { client } from './client'
import { handleApiError } from './handleApiError'

export async function exchangeNotionToken(teamId: number, code: string) {
  try {
    const res = await client.post(`/api/v1/teams/${teamId}/notion/token`, {
      code,
    })
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function getTasks(teamId: number) {
  try {
    const res = await client.get(`/api/v1/teams/${teamId}/notion/databases/primary`)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}
