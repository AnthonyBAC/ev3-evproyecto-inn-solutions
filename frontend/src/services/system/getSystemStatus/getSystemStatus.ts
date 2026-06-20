// Llama a GET /api/system-status y valida la respuesta con type guard antes de retornarla
import type { SystemStatus } from '../../../types/SystemStatus'

const SYSTEM_STATUS_ENDPOINT = '/api/system-status'

export async function getSystemStatus(): Promise<SystemStatus> {
  const response = await fetch(SYSTEM_STATUS_ENDPOINT)

  if (!response.ok) {
    throw new Error('No fue posible conectar con el backend local.')
  }

  const data: unknown = await response.json()

  if (!isSystemStatus(data)) {
    throw new Error('La respuesta del backend no tiene el formato esperado.')
  }

  return data
}

function isSystemStatus(value: unknown): value is SystemStatus {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    candidate.name === 'backend' &&
    candidate.status === 'ok' &&
    typeof candidate.timestamp === 'string'
  )
}
