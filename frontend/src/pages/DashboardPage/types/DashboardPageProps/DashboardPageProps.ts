import type { Project } from '../../../../types/Project'
import type { SystemStatus } from '../../../../types/SystemStatus'
import type { Task } from '../../../../types/Task'

export interface DashboardPageProps {
  isLoading: boolean
  isSystemStatusLoading: boolean
  onOpenProject: (projectId: string) => void
  projects: Project[]
  systemStatus: SystemStatus | null
  systemStatusErrorMessage: string | null
  tasks: Task[]
}
