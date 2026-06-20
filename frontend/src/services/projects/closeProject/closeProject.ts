// Llama a PATCH /api/projects/:id/close para cerrar un proyecto
import { getApiErrorMessage } from '../../shared/getApiErrorMessage/getApiErrorMessage'
import { isProject } from '../../../types/Project'
import type { Project } from '../../../types/Project'

export async function closeProject(projectId: string): Promise<Project> {
  const response = await fetch(`/api/projects/${projectId}/close`, {
    method: 'PATCH',
  })

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, 'No fue posible cerrar el proyecto.'))
  }

  const data: unknown = await response.json()

  if (!isProject(data)) {
    throw new Error('El proyecto cerrado no tiene el formato esperado.')
  }

  return data
}
