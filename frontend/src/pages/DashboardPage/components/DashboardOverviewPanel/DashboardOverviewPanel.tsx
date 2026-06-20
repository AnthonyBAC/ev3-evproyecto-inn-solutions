// Panel de overview — barra de progreso global y conteo de proyectos/tareas del dashboard
import { Card, Progress, Typography } from 'antd'
import { Activity } from 'lucide-react'
import type { DashboardOverviewPanelProps } from './types/DashboardOverviewPanelProps'
import './DashboardOverviewPanel.css'

export function DashboardOverviewPanel({
  globalProgress,
  isLoading,
  projectCount,
  taskCount,
}: DashboardOverviewPanelProps) {
  return (
    <Card className="dashboard-overview-panel" title="Avance general del trabajo">
      <div className="dashboard-overview-panel__content">
        <div>
          <Typography.Title level={4}>Cumplimiento global</Typography.Title>
          <Typography.Paragraph>
            El porcentaje considera las tareas completadas respecto del total registrado.
          </Typography.Paragraph>
          <Progress percent={globalProgress} strokeColor="#1677ff" />
        </div>

        <div className="dashboard-overview-panel__activity-box">
          <Activity size={20} />
          <div>
            <Typography.Text strong>Estado actual del MVP</Typography.Text>
            <Typography.Paragraph>
              {isLoading
                ? 'Cargando datos del panel...'
                : `Hay ${projectCount} proyectos y ${taskCount} tareas registradas.`}
            </Typography.Paragraph>
          </div>
        </div>
      </div>
    </Card>
  )
}
