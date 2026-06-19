import { Alert, Card, Empty, List, Select, Tag, Typography } from 'antd'
import { useMemo, useState } from 'react'
import { CreateTaskForm } from '../../components/TasksPanel/CreateTaskForm'
import type { TaskStatus } from '../../types/TaskStatus'
import type { TasksPageProps } from './types/TasksPageProps'
import './TasksPage.css'

const TASK_STATUS_OPTIONS: TaskStatus[] = ['pendiente', 'en-progreso', 'completada']
const TASK_FILTER_OPTIONS = [
  { label: 'Todas', value: 'all' },
  { label: 'Pendientes', value: 'pendiente' },
  { label: 'En progreso', value: 'en-progreso' },
  { label: 'No completadas', value: 'no-completadas' },
  { label: 'Completadas', value: 'completada' },
] as const

type TaskListStatusFilter = (typeof TASK_FILTER_OPTIONS)[number]['value']

export function TasksPage({
  errorMessage,
  isLoading,
  isSubmitting,
  onCreateTask,
  onProjectFilterChange,
  onUpdateTaskStatus,
  projects,
  selectedProjectFilter,
  tasks,
  updatingTaskId,
}: TasksPageProps) {
  const [statusFilter, setStatusFilter] = useState<TaskListStatusFilter>('all')

  const projectMap = useMemo(() => {
    return new Map(projects.map((project) => [project.id, project]))
  }, [projects])

  const normalizedProjectFilter =
    selectedProjectFilter === 'all' || projects.some((project) => project.id === selectedProjectFilter)
      ? selectedProjectFilter
      : 'all'

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesProject =
        normalizedProjectFilter === 'all' || task.projectId === normalizedProjectFilter

      if (!matchesProject) {
        return false
      }

      if (statusFilter === 'all') {
        return true
      }

      if (statusFilter === 'no-completadas') {
        return task.status !== 'completada'
      }

      return task.status === statusFilter
    })
  }, [normalizedProjectFilter, statusFilter, tasks])

  return (
    <div className="tasks-page">
      <Card title="Crear tarea" className="tasks-page__card">
        <CreateTaskForm
          isSubmitting={isSubmitting}
          projects={projects}
          onCreateTask={onCreateTask}
        />
      </Card>

      <Card title="Listado de tareas" className="tasks-page__card">
        {errorMessage ? (
          <Alert className="tasks-page__alert" message={errorMessage} type="error" showIcon />
        ) : null}

        <div className="tasks-page__filters">
          <label className="tasks-page__filter-field">
            <span>Proyecto</span>
            <Select
              options={[
                { label: 'Todos los proyectos', value: 'all' },
                ...projects.map((project) => ({ label: project.name, value: project.id })),
              ]}
              size="middle"
              value={normalizedProjectFilter}
              onChange={(value) => onProjectFilterChange(value)}
            />
          </label>

          <label className="tasks-page__filter-field">
            <span>Estado</span>
            <Select
              options={TASK_FILTER_OPTIONS.map((option) => ({
                label: option.label,
                value: option.value,
              }))}
              size="middle"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
            />
          </label>
        </div>

        {isLoading ? <Typography.Paragraph>Cargando tareas...</Typography.Paragraph> : null}

        {!isLoading && filteredTasks.length === 0 ? (
          <Empty
            description="Aun no existen tareas registradas"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : null}

        {!isLoading && filteredTasks.length > 0 ? (
          <div className="tasks-page__list-wrapper">
            <List
              className="tasks-page__list"
              dataSource={filteredTasks}
              renderItem={(task) => {
                const taskProject = projectMap.get(task.projectId)
                const isProjectClosed = taskProject?.status === 'cerrado'
                const isUpdating = updatingTaskId === task.id

                return (
                  <List.Item>
                    <div className="tasks-page__item">
                      <Typography.Text className="tasks-page__item-title" strong>
                        {task.title}
                      </Typography.Text>

                      <Tag color="blue">{task.projectName}</Tag>

                      <Typography.Text type="secondary">{task.assignee}</Typography.Text>

                      <Tag color={getTaskStatusColor(task.status)}>{task.status}</Tag>

                      {isProjectClosed ? <Tag color="default">proyecto cerrado</Tag> : null}

                      <Typography.Text type="secondary">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </Typography.Text>

                      <Select
                        className="tasks-page__status-select"
                        disabled={isProjectClosed || isUpdating}
                        loading={isUpdating}
                        options={TASK_STATUS_OPTIONS.map((status) => ({
                          label: status,
                          value: status,
                        }))}
                        value={task.status}
                        onChange={(status) => {
                          if (task.status === status) {
                            return
                          }

                          void onUpdateTaskStatus(task.id, status)
                        }}
                      />
                    </div>
                  </List.Item>
                )
              }}
            />
          </div>
        ) : null}
      </Card>
    </div>
  )
}

function getTaskStatusColor(status: string): string {
  if (status === 'completada') {
    return 'green'
  }

  if (status === 'en-progreso') {
    return 'processing'
  }

  return 'gold'
}
