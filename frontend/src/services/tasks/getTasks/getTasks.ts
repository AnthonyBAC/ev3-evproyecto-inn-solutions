// Llama a GET /api/tasks y valida que el array de respuesta tenga el formato esperado
import { getApiErrorMessage } from '../../shared/getApiErrorMessage/getApiErrorMessage'
import { isTask } from '../../../types/Task'
import type { Task } from '../../../types/Task'

const TASKS_ENDPOINT = '/api/tasks'

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(TASKS_ENDPOINT)

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, 'No fue posible cargar las tareas.'))
  }

  const data: unknown = await response.json()

  if (!Array.isArray(data) || !data.every((task) => isTask(task))) {
    throw new Error('La lista de tareas no tiene el formato esperado.')
  }

  return data
}
