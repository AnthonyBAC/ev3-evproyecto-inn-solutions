// Interfaz de Proyecto — estructura que devuelve el backend en GET/POST /api/projects
import type { ProjectStatus } from '../ProjectStatus'

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  progress: number
  taskCount: number
  completedTaskCount: number
  createdAt: string
  closedAt: string | null
}
