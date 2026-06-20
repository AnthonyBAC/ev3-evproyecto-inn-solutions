// Props del RecentProjectsPanel — lista de proyectos recientes
import type { Project } from '../../../../../../types/Project'

export interface RecentProjectsPanelProps {
  onOpenProject: (projectId: string) => void
  projects: Project[]
}
