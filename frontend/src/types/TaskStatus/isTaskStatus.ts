// Type guard — verifica que un valor sea un TaskStatus válido
import type { TaskStatus } from './TaskStatus'

export function isTaskStatus(value: unknown): value is TaskStatus {
  return value === 'pendiente' || value === 'en-progreso' || value === 'completada'
}
