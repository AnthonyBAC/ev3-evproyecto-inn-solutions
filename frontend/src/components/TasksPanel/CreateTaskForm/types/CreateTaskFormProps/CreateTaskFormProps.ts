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
