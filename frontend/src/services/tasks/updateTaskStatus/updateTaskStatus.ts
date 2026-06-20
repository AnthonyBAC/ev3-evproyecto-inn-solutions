// Llama a PATCH /api/tasks/:id/status con el nuevo status en el body
import { getApiErrorMessage } from '../../shared/getApiErrorMessage/getApiErrorMessage'
import { isTask } from '../../../types/Task'
import type { Task } from '../../../types/Task'
import type { TaskStatus } from '../../../types/TaskStatus'

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
): Promise<Task> {
  const response = await fetch(`/api/tasks/${taskId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, 'No fue posible actualizar la tarea.'))
  }

  const data: unknown = await response.json()

  if (!isTask(data)) {
    throw new Error('La tarea actualizada no tiene el formato esperado.')
  }

  return data
}
