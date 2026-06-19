import type { Project } from '../../../../../../types/Project'

export interface RecentProjectsPanelProps {
  onOpenProject: (projectId: string) => void
  projects: Project[]
}
