import { getApiErrorMessage } from '../../shared/getApiErrorMessage/getApiErrorMessage'
import { isProject } from '../../../types/Project'
import type { Project } from '../../../types/Project'

const PROJECTS_ENDPOINT = '/api/projects'

export async function createProject(
  name: string,
  description: string,
): Promise<Project> {
  const response = await fetch(PROJECTS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description }),
  })

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, 'No fue posible crear el proyecto.'))
  }

  const data: unknown = await response.json()

  if (!isProject(data)) {
    throw new Error('El proyecto creado no tiene el formato esperado.')
  }

  return data
}
