// Componente raíz — estado global, autenticación, routing manual, carga inicial de datos y handlers CRUD
import { ConfigProvider } from 'antd'
import { useEffect, useState } from 'react'
import { LoginPage } from '../pages/LoginPage'
import { createProject } from '../services/projects/createProject'
import { closeProject } from '../services/projects/closeProject'
import { getProjects } from '../services/projects/getProjects'
import { getSystemStatus } from '../services/system/getSystemStatus'
import { createTask } from '../services/tasks/createTask'
import { getTasks } from '../services/tasks/getTasks'
import { updateTaskStatus } from '../services/tasks/updateTaskStatus'
import type { AppPageKey } from '../types/AppPageKey'
import type { Project } from '../types/Project'
import type { SystemStatus } from '../types/SystemStatus'
import type { Task } from '../types/Task'
import type { TaskStatus } from '../types/TaskStatus'
import { AppLayout } from '../layouts/AppLayout'
import { DashboardPage } from '../pages/DashboardPage'
import { ProjectsPage } from '../pages/ProjectsPage'
import { TasksPage } from '../pages/TasksPage'

const PAGE_CONTENT: Record<AppPageKey, { title: string; description: string }> = {
  dashboard: {
    title: 'Panel principal',
    description:
      'Vista general del MVP con metricas de proyectos, tareas y estado de integracion.',
  },
  projects: {
    title: 'Proyectos',
    description:
      'Crea proyectos, revisa su avance y cierra los que ya no deben seguir activos.',
  },
  tasks: {
    title: 'Tareas',
    description:
      'Registra tareas, asigna responsables y actualiza su estado segun el avance real.',
  },
}

const AUTH_STORAGE_KEY = 'ev-proyecto-ev3-authenticated'
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'admin123'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true'
  })
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null)
  const [selectedPage, setSelectedPage] = useState<AppPageKey>('dashboard')
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [isSystemStatusLoading, setIsSystemStatusLoading] = useState<boolean>(true)
  const [systemStatusErrorMessage, setSystemStatusErrorMessage] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isWorkspaceLoading, setIsWorkspaceLoading] = useState<boolean>(true)
  const [projectsErrorMessage, setProjectsErrorMessage] = useState<string | null>(null)
  const [tasksErrorMessage, setTasksErrorMessage] = useState<string | null>(null)
  const [isCreatingProject, setIsCreatingProject] = useState<boolean>(false)
  const [closingProjectId, setClosingProjectId] = useState<string | null>(null)
  const [isCreatingTask, setIsCreatingTask] = useState<boolean>(false)
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)
  const [selectedTaskProjectFilter, setSelectedTaskProjectFilter] = useState<string>('all')

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    let isActive = true

    const loadInitialData = async (): Promise<void> => {
      const [systemStatusResult, projectsResult, tasksResult] = await Promise.allSettled([
        getSystemStatus(),
        getProjects(),
        getTasks(),
      ])

      if (!isActive) {
        return
      }

      if (systemStatusResult.status === 'fulfilled') {
        setSystemStatus(systemStatusResult.value)
        setSystemStatusErrorMessage(null)
      } else {
        setSystemStatusErrorMessage(
          getErrorMessage(
            systemStatusResult.reason,
            'No fue posible obtener la respuesta del backend.',
          ),
        )
      }

      if (projectsResult.status === 'fulfilled') {
        setProjects(projectsResult.value)
        setProjectsErrorMessage(null)
      } else {
        setProjectsErrorMessage(
          getErrorMessage(projectsResult.reason, 'No fue posible cargar los proyectos.'),
        )
      }

      if (tasksResult.status === 'fulfilled') {
        setTasks(tasksResult.value)
        setTasksErrorMessage(null)
      } else {
        setTasksErrorMessage(
          getErrorMessage(tasksResult.reason, 'No fue posible cargar las tareas.'),
        )
      }

      setIsSystemStatusLoading(false)
      setIsWorkspaceLoading(false)
    }

    void loadInitialData()

    return () => {
      isActive = false
    }
  }, [isAuthenticated])

  const pageContent = PAGE_CONTENT[selectedPage]

  const refreshWorkspaceData = async (): Promise<void> => {
    const [projectsResponse, tasksResponse] = await Promise.all([getProjects(), getTasks()])

    setProjects(projectsResponse)
    setTasks(tasksResponse)
  }

  const handleCreateProject = async (name: string, description: string): Promise<void> => {
    setProjectsErrorMessage(null)
    setIsCreatingProject(true)

    try {
      await createProject(name, description)
      await refreshWorkspaceData()
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'No fue posible crear el proyecto.')

      setProjectsErrorMessage(message)
      throw error
    } finally {
      setIsCreatingProject(false)
    }
  }

  const handleCloseProject = async (projectId: string): Promise<void> => {
    setProjectsErrorMessage(null)
    setClosingProjectId(projectId)

    try {
      await closeProject(projectId)
      await refreshWorkspaceData()
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'No fue posible cerrar el proyecto.')

      setProjectsErrorMessage(message)
      throw error
    } finally {
      setClosingProjectId(null)
    }
  }

  const handleCreateTask = async (
    projectId: string,
    title: string,
    description: string,
    assignee: string,
  ): Promise<void> => {
    setTasksErrorMessage(null)
    setIsCreatingTask(true)

    try {
      await createTask(projectId, title, description, assignee)
      await refreshWorkspaceData()
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'No fue posible crear la tarea.')

      setTasksErrorMessage(message)
      throw error
    } finally {
      setIsCreatingTask(false)
    }
  }

  const handleUpdateTaskStatus = async (
    taskId: string,
    status: TaskStatus,
  ): Promise<void> => {
    setTasksErrorMessage(null)
    setUpdatingTaskId(taskId)

    try {
      await updateTaskStatus(taskId, status)
      await refreshWorkspaceData()
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'No fue posible actualizar la tarea.')

      setTasksErrorMessage(message)
      throw error
    } finally {
      setUpdatingTaskId(null)
    }
  }

  const currentPage = (() => {
    if (selectedPage === 'dashboard') {
      return (
        <DashboardPage
          isLoading={isWorkspaceLoading}
          isSystemStatusLoading={isSystemStatusLoading}
          onOpenProject={handleOpenProject}
          projects={projects}
          systemStatus={systemStatus}
          systemStatusErrorMessage={systemStatusErrorMessage}
          tasks={tasks}
        />
      )
    }

    if (selectedPage === 'projects') {
      return (
        <ProjectsPage
          closingProjectId={closingProjectId}
          errorMessage={projectsErrorMessage}
          isLoading={isWorkspaceLoading}
          isSubmitting={isCreatingProject}
          onCloseProject={handleCloseProject}
          onCreateProject={handleCreateProject}
          onOpenProject={handleOpenProject}
          projects={projects}
        />
      )
    }

    return (
      <TasksPage
        errorMessage={tasksErrorMessage}
        isLoading={isWorkspaceLoading}
        isSubmitting={isCreatingTask}
        onCreateTask={handleCreateTask}
        onProjectFilterChange={setSelectedTaskProjectFilter}
        onUpdateTaskStatus={handleUpdateTaskStatus}
        projects={projects}
        selectedProjectFilter={selectedTaskProjectFilter}
        tasks={tasks}
        updatingTaskId={updatingTaskId}
      />
    )
  })()

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 14,
          colorBgLayout: '#f5f7fb',
          colorBgContainer: '#ffffff',
          colorText: '#1f2937',
        },
      }}
    >
      {!isAuthenticated ? (
        <LoginPage errorMessage={authErrorMessage} onLogin={handleLogin} />
      ) : (
      <AppLayout
        onLogout={handleLogout}
        pageDescription={pageContent.description}
        pageTitle={pageContent.title}
        selectedPage={selectedPage}
        onSelectPage={setSelectedPage}
      >
        {currentPage}
      </AppLayout>
      )}
    </ConfigProvider>
  )

  function handleLogin(username: string, password: string): void {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setAuthErrorMessage(null)
      setIsAuthenticated(true)
      window.sessionStorage.setItem(AUTH_STORAGE_KEY, 'true')
      return
    }

    setAuthErrorMessage('Credenciales invalidas. Usa admin / admin123.')
  }

  function handleLogout(): void {
    setIsAuthenticated(false)
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
  }

  function handleOpenProject(projectId: string): void {
    setSelectedTaskProjectFilter(projectId)
    setSelectedPage('tasks')
  }
}

export default App

function getErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error) {
    return error.message
  }

  return fallbackMessage
}
