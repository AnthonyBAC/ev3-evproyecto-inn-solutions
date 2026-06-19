import { getApiErrorMessage } from '../../shared/getApiErrorMessage/getApiErrorMessage'
import { isTask } from '../../../types/Task'
import type { Task } from '../../../types/Task'

const TASKS_ENDPOINT = '/api/tasks'

export async function createTask(
  projectId: string,
  title: string,
  description: string,
  assignee: string,
): Promise<Task> {
  const response = await fetch(TASKS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ projectId, title, description, assignee }),
  })

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, 'No fue posible crear la tarea.'))
  }

  const data: unknown = await response.json()

  if (!isTask(data)) {
    throw new Error('La tarea creada no tiene el formato esperado.')
  }

  return data
}
