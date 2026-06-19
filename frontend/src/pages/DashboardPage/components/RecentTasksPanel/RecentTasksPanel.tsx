import { Card, Empty, List, Tag, Typography } from 'antd'
import type { Task } from '../../../../types/Task'
import type { RecentTasksPanelProps } from './types/RecentTasksPanelProps'
import './RecentTasksPanel.css'

export function RecentTasksPanel({ tasks }: RecentTasksPanelProps) {
  return (
    <Card className="recent-tasks-panel" title="Tareas recientes">
      <div className="recent-tasks-panel__scroll-area">
        {tasks.length === 0 ? (
          <Empty description="Aun no existen tareas registradas" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <List
            dataSource={tasks}
            renderItem={(task) => (
              <List.Item>
                <div className="recent-tasks-panel__item">
                  <div>
                    <Typography.Text strong>{task.title}</Typography.Text>
                    <Typography.Paragraph className="recent-tasks-panel__description">
                      {task.projectName} · {task.assignee}
                    </Typography.Paragraph>
                  </div>

                  <Tag color={getTaskStatusColor(task.status)}>{task.status}</Tag>
                </div>
              </List.Item>
            )}
          />
        )}
      </div>
    </Card>
  )
}

function getTaskStatusColor(status: Task['status']): string {
  if (status === 'completada') {
    return 'green'
  }

  if (status === 'en-progreso') {
    return 'processing'
  }

  return 'gold'
}
