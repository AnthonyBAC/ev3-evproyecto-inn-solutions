// Type guard en runtime — verifica que un objeto desconocido tenga la forma de Task
import { isTaskStatus } from '../TaskStatus'
import type { Task } from './Task'

export function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.projectId === 'string' &&
    typeof candidate.projectName === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.description === 'string' &&
    typeof candidate.assignee === 'string' &&
    isTaskStatus(candidate.status) &&
    typeof candidate.createdAt === 'string'
  )
}
