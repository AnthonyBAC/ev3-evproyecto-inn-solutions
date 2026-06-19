import { Alert, Button, Card, Empty, Input, List, Select, Tag, Typography } from 'antd'
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { COMPANY_WORKERS } from '../../mocks/companyWorkers'
import type { TaskStatus } from '../../types/TaskStatus'
import type { TasksPageProps } from './types/TasksPageProps'
import './TasksPage.css'

const { TextArea } = Input

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
  const [projectId, setProjectId] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [assignee, setAssignee] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<TaskListStatusFilter>('all')

  const activeProjects = useMemo(
    () => projects.filter((project) => project.status !== 'cerrado'),
    [projects],
  )

  const selectedProjectId =
    activeProjects.find((project) => project.id === projectId)?.id ?? activeProjects[0]?.id ?? ''

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    try {
      await onCreateTask(selectedProjectId, title, description, assignee)
      setTitle('')
      setDescription('')
      setAssignee('')
    } catch {
      return
    }
  }

  return (
    <div className="tasks-page">
      <Card title="Crear tarea" className="tasks-page__card">
        <form className="tasks-page__form" onSubmit={handleSubmit}>
          <div className="tasks-page__form-grid">
            <div className="tasks-page__form-column tasks-page__form-column--inputs">
              <label className="tasks-page__field">
                <span>Proyecto</span>
                <Select
                  disabled={isSubmitting || activeProjects.length === 0}
                  options={activeProjects.map((project) => ({
                    label: project.name,
                    value: project.id,
                  }))}
                  placeholder="Selecciona un proyecto abierto"
                  size="small"
                  value={selectedProjectId || undefined}
                  onChange={(value) => setProjectId(value)}
                />
              </label>

              <label className="tasks-page__field">
                <span>Titulo</span>
                <Input
                  disabled={isSubmitting || activeProjects.length === 0}
                  placeholder="Ejemplo: Revisar tablero principal"
                  size="small"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </label>

              <label className="tasks-page__field">
                <span>Responsable</span>
                <Select
                  disabled={isSubmitting || activeProjects.length === 0}
                  options={COMPANY_WORKERS.map((worker) => ({
                    label: `${worker.name} · ${worker.role}`,
                    value: worker.name,
                  }))}
                  placeholder="Selecciona un responsable"
                  showSearch
                  size="small"
                  value={assignee || undefined}
                  onChange={(value) => setAssignee(value)}
                  optionFilterProp="label"
                />
              </label>
            </div>

            <div className="tasks-page__form-column tasks-page__form-column--description">
              <label className="tasks-page__field tasks-page__field--description">
                <span>Descripcion</span>
                <TextArea
                  disabled={isSubmitting || activeProjects.length === 0}
                  placeholder="Describe brevemente la tarea"
                  rows={6}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </label>
            </div>
          </div>

          <Button block htmlType="submit" loading={isSubmitting} size="large" type="primary">
            Crear tarea
          </Button>
        </form>

        {activeProjects.length === 0 ? (
          <Typography.Paragraph className="tasks-page__hint">
            Debes tener al menos un proyecto abierto para registrar tareas nuevas.
          </Typography.Paragraph>
        ) : null}
      </Card>

      <Card title="Listado de tareas" className="tasks-page__card">
        {errorMessage ? <Alert className="tasks-page__alert" message={errorMessage} type="error" showIcon /> : null}

        <div className="tasks-page__filters">
          <label className="tasks-page__filter-field">
            <span>Proyecto</span>
            <Select
              options={[
                { label: 'Todos los proyectos', value: 'all' },
                ...projects.map((project) => ({ label: project.name, value: project.id })),
              ]}
              size="small"
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
              size="small"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
            />
          </label>
        </div>

        {isLoading ? <Typography.Paragraph>Cargando tareas...</Typography.Paragraph> : null}

        {!isLoading && filteredTasks.length === 0 ? (
          <Empty description="Aun no existen tareas registradas" image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
