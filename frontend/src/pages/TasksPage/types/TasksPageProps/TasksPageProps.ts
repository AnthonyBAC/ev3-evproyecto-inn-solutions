import type { Project } from '../../../../types/Project'
import type { Task } from '../../../../types/Task'
import type { TaskStatus } from '../../../../types/TaskStatus'

export interface TasksPageProps {
  errorMessage: string | null
  isLoading: boolean
  isSubmitting: boolean
  onCreateTask: (
    projectId: string,
    title: string,
    description: string,
    assignee: string,
  ) => Promise<void>
  onProjectFilterChange: (projectId: string) => void
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>
  projects: Project[]
  selectedProjectFilter: string
  tasks: Task[]
  updatingTaskId: string | null
}
