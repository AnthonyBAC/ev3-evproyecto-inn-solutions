import type { TaskStatus } from './TaskStatus'

export function isTaskStatus(value: unknown): value is TaskStatus {
  return value === 'pendiente' || value === 'en-progreso' || value === 'completada'
}
