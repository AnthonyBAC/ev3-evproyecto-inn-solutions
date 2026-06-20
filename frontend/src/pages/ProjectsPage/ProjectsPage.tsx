// Página de proyectos — formulario de creación, listado con filtros por estado/fecha, cierre con modal de confirmación
import { Alert, Button, Card, Empty, Input, List, Modal, Progress, Select, Space, Tag, Typography } from 'antd'
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { ProjectsPageProps } from './types/ProjectsPageProps'
import './ProjectsPage.css'

const { TextArea } = Input

export function ProjectsPage({
  closingProjectId,
  errorMessage,
  isLoading,
  isSubmitting,
  onCloseProject,
  onCreateProject,
  onOpenProject,
  projects,
}: ProjectsPageProps) {
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [dateOrder, setDateOrder] = useState<'desc' | 'asc'>('desc')
  const [statusFilter, setStatusFilter] = useState<'all' | 'abierto' | 'cerrado'>('all')
  const [modal, contextHolder] = Modal.useModal()

  const filteredProjects = useMemo(() => {
    const filtered = statusFilter === 'all'
      ? projects
      : statusFilter === 'abierto'
        ? projects.filter((project) => project.status !== 'cerrado')
        : projects.filter((project) => project.status === 'cerrado')

    const sorted = [...filtered].sort((firstProject, secondProject) => {
      const firstDate = Date.parse(firstProject.createdAt)
      const secondDate = Date.parse(secondProject.createdAt)
      return dateOrder === 'desc' ? secondDate - firstDate : firstDate - secondDate
    })
    return sorted
  }, [dateOrder, statusFilter, projects])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    try {
      await onCreateProject(name, description)
      setName('')
      setDescription('')
    } catch {
      return
    }
  }

  return (
    <div className="projects-page">
      {contextHolder}

      <Card size="small" title="Crear proyecto" className="projects-page__card projects-page__card--form">
        <form className="projects-page__form" onSubmit={handleSubmit}>
          <div className="projects-page__form-fields">
            <label className="projects-page__field projects-page__field--name">
              <span>Nombre del proyecto</span>
              <Input
                disabled={isSubmitting}
                placeholder="Ejemplo: Sistema EV3"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>

            <label className="projects-page__field projects-page__field--description">
              <span>Descripcion</span>
              <TextArea
                disabled={isSubmitting}
                placeholder="Describe el objetivo principal del proyecto"
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </label>
          </div>

          <div className="projects-page__form-actions">
            <Button
              disabled={name.trim().length === 0}
              htmlType="submit"
              loading={isSubmitting}
              type="primary"
            >
              Crear proyecto
            </Button>
          </div>
        </form>
      </Card>

      <Card size="small" title="Listado de proyectos" className="projects-page__card projects-page__card--list">
        {errorMessage ? <Alert className="projects-page__alert" message={errorMessage} type="error" showIcon /> : null}

        <div className="projects-page__filters">
          <label className="projects-page__filter-field">
            <span>Estado</span>
            <Select
              options={[
                { label: 'Todos', value: 'all' },
                { label: 'Abiertos', value: 'abierto' },
                { label: 'Cerrados', value: 'cerrado' },
              ]}
              size="small"
              style={{ width: 160 }}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as 'all' | 'abierto' | 'cerrado')}
            />
          </label>

          <label className="projects-page__filter-field">
            <span>Ordenar por fecha</span>
            <Select
              options={[
                { label: 'Mayor a menor', value: 'desc' },
                { label: 'Menor a mayor', value: 'asc' },
              ]}
              size="small"
              style={{ width: 180 }}
              value={dateOrder}
              onChange={(value) => setDateOrder(value as 'desc' | 'asc')}
            />
          </label>

          <Button
            disabled={dateOrder === 'desc' && statusFilter === 'all'}
            size="small"
            onClick={() => {
              setDateOrder('desc')
              setStatusFilter('all')
            }}
          >
            Limpiar filtros
          </Button>
        </div>

        {isLoading ? <Typography.Paragraph>Cargando proyectos...</Typography.Paragraph> : null}

        {!isLoading && filteredProjects.length === 0 ? (
          <Empty description="Aun no hay proyectos creados" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : null}

        {!isLoading && filteredProjects.length > 0 ? (
          <div className="projects-page__list-wrapper">
            <List
              className="projects-page__list"
              dataSource={filteredProjects}
              renderItem={(project) => {
                const isClosing = closingProjectId === project.id

                return (
                  <List.Item>
                    <div className="projects-page__item">
                      <div className="projects-page__item-primary">
                        <button
                          className="projects-page__project-link"
                          type="button"
                          onClick={() => onOpenProject(project.id)}
                        >
                          {project.name}
                        </button>

                        <Space size={8} wrap>
                          <Tag color={getProjectStatusColor(project.status)}>{project.status}</Tag>
                        </Space>
                      </div>

                      <div className="projects-page__item-progress">
                        <Progress percent={project.progress} showInfo={false} size="small" strokeColor="#1677ff" />
                        <Typography.Text>{project.progress}%</Typography.Text>
                      </div>

                      <Typography.Text type="secondary">{project.taskCount} tareas</Typography.Text>
                      <Typography.Text type="secondary">
                        {project.completedTaskCount} completadas
                      </Typography.Text>
                      <Typography.Text type="secondary">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </Typography.Text>

                      {project.status !== 'cerrado' ? (
                        <Button
                          disabled={isClosing}
                          onClick={() => {
                            modal.confirm({
                              title: 'Cerrar proyecto',
                              content:
                                'Al cerrar el proyecto ya no se podran crear ni actualizar tareas en este proyecto.',
                              okText: 'Confirmar cierre',
                              cancelText: 'Cancelar',
                              okButtonProps: { danger: true },
                              onOk: async () => {
                                await onCloseProject(project.id)
                              },
                            })
                          }}
                        >
                          Cerrar proyecto
                        </Button>
                      ) : (
                        <Typography.Text type="secondary">
                          Cerrado {project.closedAt ? new Date(project.closedAt).toLocaleDateString() : ''}
                        </Typography.Text>
                      )}
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

function getProjectStatusColor(status: string): string {
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
