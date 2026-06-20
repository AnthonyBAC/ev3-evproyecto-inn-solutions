// Props del CreateTaskForm — proyectos, handler de creación, estado de loading
import type { Project } from '../../../../../types/Project'

export interface CreateTaskFormProps {
  isSubmitting: boolean
  projects: Project[]
  onCreateTask: (
    projectId: string,
    title: string,
    description: string,
    assignee: string,
  ) => Promise<void>
}
