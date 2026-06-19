import { Card, Empty, List, Tag, Typography } from 'antd'
import type { Project } from '../../../../types/Project'
import type { RecentProjectsPanelProps } from './types/RecentProjectsPanelProps'
import './RecentProjectsPanel.css'

export function RecentProjectsPanel({
  onOpenProject,
  projects,
}: RecentProjectsPanelProps) {
  return (
    <Card className="recent-projects-panel" title="Proyectos recientes">
      <div className="recent-projects-panel__scroll-area">
        {projects.length === 0 ? (
          <Empty description="Aun no existen proyectos creados" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <List
            dataSource={projects}
            renderItem={(project) => (
              <List.Item>
                <div className="recent-projects-panel__item">
                  <div>
                    <button
                      className="recent-projects-panel__link"
                      type="button"
                      onClick={() => onOpenProject(project.id)}
                    >
                      {project.name}
                    </button>
                    <Typography.Paragraph className="recent-projects-panel__description">
                      {project.description}
                    </Typography.Paragraph>
                  </div>

                  <div className="recent-projects-panel__tag-group">
                    <Tag color={getProjectStatusColor(project.status)}>{project.status}</Tag>
                  </div>
                </div>
              </List.Item>
            )}
          />
        )}
      </div>
    </Card>
  )
}

function getProjectStatusColor(status: Project['status']): string {
  if (status === 'completado') {
    return 'green'
  }

  if (status === 'en-progreso') {
    return 'cyan'
  }

  if (status === 'abierto') {
    return 'blue'
  }

  if (status === 'cerrado') {
    return 'default'
  }

  return 'gold'
}
