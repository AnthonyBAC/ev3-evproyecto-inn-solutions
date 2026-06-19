import { Button, Form, Input, Select, Typography } from 'antd'
import { useState } from 'react'
import { COMPANY_WORKERS } from '../../../mocks/companyWorkers'
import type { Project } from '../../../types/Project'
import type { CreateTaskFormProps } from './types/CreateTaskFormProps'
import './CreateTaskForm.css'

const { TextArea } = Input

interface CreateTaskFormValues {
  projectId: string
  title: string
  description: string
  assignee: string
}

export function CreateTaskForm({
  isSubmitting,
  onCreateTask,
  projects,
}: CreateTaskFormProps) {
  const [form] = Form.useForm<CreateTaskFormValues>()
  const [currentProjectId, setCurrentProjectId] = useState<string>('')

  const activeProjects = projects.filter((project) => project.status !== 'cerrado')

  const resolvedProjectId =
    activeProjects.find((project) => project.id === currentProjectId)?.id ??
    activeProjects[0]?.id ??
    ''

  const handleValuesChange = (changed: Partial<CreateTaskFormValues>): void => {
    if (changed.projectId !== undefined) {
      setCurrentProjectId(changed.projectId)
    }
  }

  const handleFinish = async (values: CreateTaskFormValues): Promise<void> => {
    try {
      await onCreateTask(values.projectId, values.title, values.description, values.assignee)
      form.resetFields(['title', 'description', 'assignee'])
    } catch {
      return
    }
  }

  const isDisabled = isSubmitting || activeProjects.length === 0

  return (
    <Form
      className="create-task-form"
      form={form}
      layout="vertical"
      initialValues={{ projectId: resolvedProjectId || undefined }}
      onFinish={handleFinish}
      onValuesChange={handleValuesChange}
    >
      <div className="create-task-form__grid">
        <div className="create-task-form__column create-task-form__column--inputs">
          <Form.Item
            className="create-task-form__field"
            label="Proyecto"
            name="projectId"
            rules={[{ required: true, message: 'Selecciona un proyecto' }]}
          >
            <Select
              disabled={isDisabled}
              options={activeProjects.map((project) => ({
                label: project.name,
                value: project.id,
              }))}
              placeholder="Selecciona un proyecto abierto"
              size="middle"
            />
          </Form.Item>

          <Form.Item
            className="create-task-form__field"
            label="Titulo"
            name="title"
            rules={[{ required: true, message: 'Ingresa un titulo' }]}
          >
            <Input
              disabled={isDisabled}
              placeholder="Ejemplo: Revisar tablero principal"
              size="middle"
            />
          </Form.Item>

          <Form.Item
            className="create-task-form__field"
            label="Responsable"
            name="assignee"
            rules={[{ required: true, message: 'Asigna un responsable' }]}
          >
            <Select
              disabled={isDisabled}
              options={COMPANY_WORKERS.map((worker) => ({
                label: `${worker.name} · ${worker.role}`,
                value: worker.name,
              }))}
              placeholder="Selecciona un responsable"
              showSearch
              size="middle"
              optionFilterProp="label"
            />
          </Form.Item>
        </div>

        <div className="create-task-form__column create-task-form__column--description">
          <Form.Item
            className="create-task-form__field create-task-form__field--description"
            label="Descripcion"
            name="description"
            rules={[{ required: true, message: 'Agrega una descripcion' }]}
          >
            <TextArea
              disabled={isDisabled}
              placeholder="Describe brevemente la tarea"
            />
          </Form.Item>
        </div>
      </div>

      <Form.Item className="create-task-form__actions">
        <Button
          disabled={isDisabled}
          htmlType="submit"
          loading={isSubmitting}
          type="primary"
        >
          Crear tarea
        </Button>
      </Form.Item>

      {activeProjects.length === 0 ? (
        <Typography.Paragraph className="create-task-form__hint">
          Debes tener al menos un proyecto abierto para registrar tareas nuevas.
        </Typography.Paragraph>
      ) : null}
    </Form>
  )
}

export type { Project }
