// Interfaz de Tarea — estructura que devuelve el backend en GET/POST /api/tasks
import type { TaskStatus } from '../TaskStatus'

export interface Task {
  id: string
  projectId: string
  projectName: string
  title: string
  description: string
  assignee: string
  status: TaskStatus
  createdAt: string
}
