// Type guard en runtime — verifica que un objeto desconocido tenga la forma de Project
import { isProjectStatus } from '../ProjectStatus'
import type { Project } from './Project'

export function isProject(value: unknown): value is Project {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.description === 'string' &&
    isProjectStatus(candidate.status) &&
    typeof candidate.progress === 'number' &&
    typeof candidate.taskCount === 'number' &&
    typeof candidate.completedTaskCount === 'number' &&
    typeof candidate.createdAt === 'string' &&
    (typeof candidate.closedAt === 'string' || candidate.closedAt === null)
  )
}
