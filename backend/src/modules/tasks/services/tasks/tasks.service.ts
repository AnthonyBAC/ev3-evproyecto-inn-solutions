import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PROJECT_IDS } from '../../../projects/constants/project-ids/project-ids';
import { randomUUID } from 'crypto';
import { ProjectsService } from '../../../projects/services/projects/projects.service';
import { CreateTaskDto } from '../../dto/create-task-dto/create-task.dto';
import { TaskResponseDto } from '../../dto/task-response-dto/task-response.dto';
import { UpdateTaskStatusDto } from '../../dto/update-task-status-dto/update-task-status.dto';
import { TaskEntity } from '../../entities/task/task.entity';
import { TaskStatus } from '../../types/task-status/task-status.type';

@Injectable()
export class TasksService {
  private readonly tasks: TaskEntity[] = [];

  constructor(private readonly projectsService: ProjectsService) {
    const mockTasks = this.buildMockTasks();

    this.tasks.push(...mockTasks);
    this.syncMockProjects(mockTasks);
  }

  createTask(createTaskDto: CreateTaskDto): TaskResponseDto {
    const project = this.projectsService.findProjectById(
      createTaskDto.projectId,
    );

    if (project.status === 'cerrado') {
      throw new BadRequestException(
        'No se pueden crear tareas en un proyecto cerrado.',
      );
    }

    const title = this.validateText(
      createTaskDto.title,
      'El titulo de la tarea es obligatorio.',
    );
    const description = this.validateText(
      createTaskDto.description,
      'La descripcion de la tarea es obligatoria.',
    );
    const assignee = this.validateText(
      createTaskDto.assignee,
      'El responsable de la tarea es obligatorio.',
    );

    const task = new TaskEntity(
      randomUUID(),
      project.id,
      title,
      description,
      assignee,
      'pendiente',
      new Date().toISOString(),
    );

    this.tasks.unshift(task);
    this.syncProject(project.id);

    return this.toTaskResponseDto(task, project.name);
  }

  findAllTasks(): TaskResponseDto[] {
    return this.tasks.map((task) => {
      const projectName = this.projectsService.findProjectById(
        task.projectId,
      ).name;

      return this.toTaskResponseDto(task, projectName);
    });
  }

  updateTaskStatus(
    taskId: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): TaskResponseDto {
    const task = this.findTaskById(taskId);
    const status = this.validateTaskStatus(updateTaskStatusDto.status);
    const project = this.projectsService.findProjectById(task.projectId);

    if (project.status === 'cerrado') {
      throw new BadRequestException(
        'No se pueden actualizar tareas de un proyecto cerrado.',
      );
    }

    task.status = status;
    this.syncProject(task.projectId);

    const projectName = project.name;

    return this.toTaskResponseDto(task, projectName);
  }

  private findTaskById(taskId: string): TaskEntity {
    const task = this.tasks.find((currentTask) => currentTask.id === taskId);

    if (!task) {
      throw new NotFoundException('La tarea solicitada no existe.');
    }

    return task;
  }

  private syncProject(projectId: string): void {
    const projectTasks = this.tasks.filter(
      (task) => task.projectId === projectId,
    );
    const completedTaskCount = projectTasks.filter(
      (task) => task.status === 'completada',
    ).length;

    this.projectsService.syncProjectMetrics(
      projectId,
      projectTasks.length,
      completedTaskCount,
    );
  }

  private toTaskResponseDto(
    task: TaskEntity,
    projectName: string,
  ): TaskResponseDto {
    return new TaskResponseDto(
      task.id,
      task.projectId,
      projectName,
      task.title,
      task.description,
      task.assignee,
      task.status,
      task.createdAt,
    );
  }

  private validateTaskStatus(value: string | undefined): TaskStatus {
    if (
      value === 'pendiente' ||
      value === 'en-progreso' ||
      value === 'completada'
    ) {
      return value;
    }

    throw new BadRequestException('El estado de la tarea no es valido.');
  }

  private validateText(value: string | undefined, message: string): string {
    const normalizedValue = value?.trim();

    if (!normalizedValue) {
      throw new BadRequestException(message);
    }

    return normalizedValue;
  }

  private buildMockTasks(): TaskEntity[] {
    return [
      new TaskEntity(
        'task-portal-wireframes',
        PROJECT_IDS.portalClientes,
        'Definir estructura del portal',
        'Organizar la estructura principal y los accesos clave del portal corporativo.',
        'Javiera Diaz',
        'completada',
        this.createIsoDate('2026-05-19T10:00:00.000Z'),
      ),
      new TaskEntity(
        'task-portal-api',
        PROJECT_IDS.portalClientes,
        'Preparar integracion inicial',
        'Definir contratos REST para los modulos base de seguimiento.',
        'Matias Herrera',
        'completada',
        this.createIsoDate('2026-05-23T14:20:00.000Z'),
      ),
      new TaskEntity(
        'task-portal-qa',
        PROJECT_IDS.portalClientes,
        'Validar flujo de consultas',
        'Revisar el flujo completo de registro y seguimiento desde la perspectiva del usuario.',
        'Fernanda Morales',
        'en-progreso',
        this.createIsoDate('2026-06-01T09:40:00.000Z'),
      ),
      new TaskEntity(
        'task-app-mapa',
        PROJECT_IDS.appInterna,
        'Mapear procesos operativos',
        'Documentar los procesos actuales para trasladarlos al nuevo flujo interno.',
        'Diego Rojas',
        'completada',
        this.createIsoDate('2026-05-29T11:30:00.000Z'),
      ),
      new TaskEntity(
        'task-app-prioridades',
        PROJECT_IDS.appInterna,
        'Definir prioridades del backlog',
        'Ordenar los requerimientos del area operativa para la primera entrega del MVP.',
        'Martina Fuentes',
        'pendiente',
        this.createIsoDate('2026-06-03T16:10:00.000Z'),
      ),
      new TaskEntity(
        'task-tablero-metricas',
        PROJECT_IDS.tableroGerencial,
        'Configurar metricas base',
        'Preparar metricas de proyectos activos, progreso y carga operativa.',
        'Benjamin Araya',
        'completada',
        this.createIsoDate('2026-06-03T12:20:00.000Z'),
      ),
      new TaskEntity(
        'task-tablero-ui',
        PROJECT_IDS.tableroGerencial,
        'Ajustar interfaz ejecutiva',
        'Aplicar una vista clara y directa para la jefatura y los lideres de area.',
        'Valentina Perez',
        'completada',
        this.createIsoDate('2026-06-07T09:05:00.000Z'),
      ),
      new TaskEntity(
        'task-migracion-respaldo',
        PROJECT_IDS.migracionInventario,
        'Preparar respaldo historico',
        'Resguardar los datos antes de migrar informacion desde el sistema legado.',
        'Nicolas Vega',
        'pendiente',
        this.createIsoDate('2026-06-06T15:25:00.000Z'),
      ),
      new TaskEntity(
        'task-reportes-script',
        PROJECT_IDS.automatizacionReportes,
        'Automatizar generacion semanal',
        'Desarrollar el proceso base para generar reportes recurrentes.',
        'Camila Soto',
        'completada',
        this.createIsoDate('2026-04-28T10:10:00.000Z'),
      ),
      new TaskEntity(
        'task-reportes-validacion',
        PROJECT_IDS.automatizacionReportes,
        'Validar distribucion de reportes',
        'Comprobar formato, datos y frecuencia de entrega a las jefaturas.',
        'Tomas Sepulveda',
        'completada',
        this.createIsoDate('2026-05-14T17:15:00.000Z'),
      ),
      new TaskEntity(
        'task-soporte-cierre',
        PROJECT_IDS.centroSoporte,
        'Consolidar flujo de atencion',
        'Unificar criterios de derivacion y cierre para solicitudes internas.',
        'Martina Fuentes',
        'completada',
        this.createIsoDate('2026-04-11T13:35:00.000Z'),
      ),
    ];
  }

  private syncMockProjects(mockTasks: TaskEntity[]): void {
    const projectIds = new Set(mockTasks.map((task) => task.projectId));

    projectIds.forEach((projectId) => {
      this.syncProject(projectId);
    });
  }

  private createIsoDate(value: string): string {
    return new Date(value).toISOString();
  }
}
