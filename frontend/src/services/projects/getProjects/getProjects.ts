// Llama a GET /api/projects y valida que el array de respuesta tenga el formato esperado
import { getApiErrorMessage } from '../../shared/getApiErrorMessage/getApiErrorMessage'
import { isProject } from '../../../types/Project'
import type { Project } from '../../../types/Project'

const PROJECTS_ENDPOINT = '/api/projects'

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(PROJECTS_ENDPOINT)

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, 'No fue posible cargar los proyectos.'))
  }

  const data: unknown = await response.json()

  if (!Array.isArray(data) || !data.every((project) => isProject(project))) {
    throw new Error('La lista de proyectos no tiene el formato esperado.')
  }

  return data
}
