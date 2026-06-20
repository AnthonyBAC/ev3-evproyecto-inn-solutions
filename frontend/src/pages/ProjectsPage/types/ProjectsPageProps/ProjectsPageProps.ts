// Props de ProjectsPage — proyectos, handlers CRUD, estados de loading
import type { Project } from '../../../../types/Project'

export interface ProjectsPageProps {
  closingProjectId: string | null
  errorMessage: string | null
  isLoading: boolean
  isSubmitting: boolean
  onCloseProject: (projectId: string) => Promise<void>
  onCreateProject: (name: string, description: string) => Promise<void>
  onOpenProject: (projectId: string) => void
  projects: Project[]
}
