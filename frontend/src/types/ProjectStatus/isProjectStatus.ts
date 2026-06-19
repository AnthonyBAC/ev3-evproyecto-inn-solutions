import type { ProjectStatus } from './ProjectStatus'

export function isProjectStatus(value: unknown): value is ProjectStatus {
  return (
    value === 'abierto' ||
    value === 'pendiente' ||
    value === 'en-progreso' ||
    value === 'completado' ||
    value === 'cerrado'
  )
}
