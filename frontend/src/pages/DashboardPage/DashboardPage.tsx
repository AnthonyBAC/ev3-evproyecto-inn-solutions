// Página principal — 4 métricas en cards, panel de overview, estado del sistema, proyectos y tareas recientes
import { Card, Col, Row, Statistic } from 'antd'
import { FolderCheck, FolderOpen, ListChecks, ListTodo } from 'lucide-react'
import { DashboardOverviewPanel } from './components/DashboardOverviewPanel'
import { RecentProjectsPanel } from './components/RecentProjectsPanel'
import { RecentTasksPanel } from './components/RecentTasksPanel'
import { SystemStatusCard } from '../../components/SystemStatusCard'
import type { DashboardPageProps } from './types/DashboardPageProps'
import './DashboardPage.css'

export function DashboardPage({
  isLoading,
  isSystemStatusLoading,
  onOpenProject,
  projects,
  systemStatus,
  systemStatusErrorMessage,
  tasks,
}: DashboardPageProps) {
  const recentProjects = [...projects].sort(
    (firstProject, secondProject) =>
      Date.parse(secondProject.createdAt) - Date.parse(firstProject.createdAt),
  )
  const recentTasks = [...tasks].sort(
    (firstTask, secondTask) =>
      Date.parse(secondTask.createdAt) - Date.parse(firstTask.createdAt),
  )
  const activeProjectsCount = projects.filter(
    (project) => project.status !== 'cerrado',
  ).length
  const closedProjectsCount = projects.filter(
    (project) => project.status === 'cerrado',
  ).length
  const completedTasksCount = tasks.filter((task) => task.status === 'completada').length
  const globalProgress = tasks.length === 0 ? 0 : Math.round((completedTasksCount / tasks.length) * 100)

  return (
    <div className="dashboard-page">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={6}>
          <Card className="dashboard-page__metric-card">
            <Statistic prefix={<FolderCheck size={18} />} title="Proyectos activos" value={activeProjectsCount} />
          </Card>
        </Col>

        <Col xs={24} md={12} xl={6}>
          <Card className="dashboard-page__metric-card">
            <Statistic prefix={<FolderOpen size={18} />} title="Proyectos cerrados" value={closedProjectsCount} />
          </Card>
        </Col>

        <Col xs={24} md={12} xl={6}>
          <Card className="dashboard-page__metric-card">
            <Statistic prefix={<ListTodo size={18} />} title="Tareas totales" value={tasks.length} />
          </Card>
        </Col>

        <Col xs={24} md={12} xl={6}>
          <Card className="dashboard-page__metric-card">
            <Statistic prefix={<ListChecks size={18} />} title="Tareas completadas" value={completedTasksCount} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <DashboardOverviewPanel
            globalProgress={globalProgress}
            isLoading={isLoading}
            projectCount={projects.length}
            taskCount={tasks.length}
          />
        </Col>

        <Col xs={24} xl={8}>
          <SystemStatusCard
            errorMessage={systemStatusErrorMessage}
            isLoading={isSystemStatusLoading}
            systemStatus={systemStatus}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <RecentProjectsPanel onOpenProject={onOpenProject} projects={recentProjects} />
        </Col>

        <Col xs={24} xl={12}>
          <RecentTasksPanel tasks={recentTasks} />
        </Col>
      </Row>
    </div>
  )
}
