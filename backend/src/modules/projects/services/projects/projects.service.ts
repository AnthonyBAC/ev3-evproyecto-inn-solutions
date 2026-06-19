import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PROJECT_IDS } from '../../constants/project-ids/project-ids';
import { CreateProjectDto } from '../../dto/create-project-dto/create-project.dto';
import { ProjectResponseDto } from '../../dto/project-response-dto/project-response.dto';
import { ProjectEntity } from '../../entities/project/project.entity';
import { ProjectStatus } from '../../types/project-status/project-status.type';

@Injectable()
export class ProjectsService {
  private readonly projects: ProjectEntity[] = [];

  constructor() {
    this.projects.push(...this.buildMockProjects());
  }

  createProject(createProjectDto: CreateProjectDto): ProjectResponseDto {
    const name = this.validateText(
      createProjectDto.name,
      'El nombre del proyecto es obligatorio.',
    );
    const description = this.validateText(
      createProjectDto.description,
      'La descripcion del proyecto es obligatoria.',
    );

    const project = new ProjectEntity(
      randomUUID(),
      name,
      description,
      'abierto',
      0,
      0,
      0,
      new Date().toISOString(),
      null,
    );

    this.projects.unshift(project);

    return this.toProjectResponseDto(project);
  }

  findAllProjects(): ProjectResponseDto[] {
    return this.projects.map((project) => this.toProjectResponseDto(project));
  }

  findProjectById(projectId: string): ProjectEntity {
    const project = this.projects.find(
      (currentProject) => currentProject.id === projectId,
    );

    if (!project) {
      throw new NotFoundException('El proyecto solicitado no existe.');
    }

    return project;
  }

  closeProject(projectId: string): ProjectResponseDto {
    const project = this.findProjectById(projectId);

    if (project.status === 'cerrado') {
      return this.toProjectResponseDto(project);
    }

    project.status = 'cerrado';
    project.closedAt = new Date().toISOString();

    return this.toProjectResponseDto(project);
  }

  syncProjectMetrics(
    projectId: string,
    taskCount: number,
    completedTaskCount: number,
  ): ProjectResponseDto {
    const project = this.findProjectById(projectId);

    project.taskCount = taskCount;
    project.completedTaskCount = completedTaskCount;
    project.progress =
      taskCount === 0 ? 0 : Math.round((completedTaskCount / taskCount) * 100);

    if (project.status !== 'cerrado') {
      project.status = this.getProjectStatus(taskCount, project.progress);
    }

    return this.toProjectResponseDto(project);
  }

  private getProjectStatus(taskCount: number, progress: number): ProjectStatus {
    if (taskCount === 0) {
      return 'abierto';
    }

    if (progress === 0) {
      return 'pendiente';
    }

    if (progress === 100) {
      return 'completado';
    }

    return 'en-progreso';
  }

  private toProjectResponseDto(project: ProjectEntity): ProjectResponseDto {
    return new ProjectResponseDto(
      project.id,
      project.name,
      project.description,
      project.status,
      project.progress,
      project.taskCount,
      project.completedTaskCount,
      project.createdAt,
      project.closedAt,
    );
  }

  isProjectClosed(projectId: string): boolean {
    return this.findProjectById(projectId).status === 'cerrado';
  }

  private validateText(value: string | undefined, message: string): string {
    const normalizedValue = value?.trim();

    if (!normalizedValue) {
      throw new BadRequestException(message);
    }

    return normalizedValue;
  }

  private buildMockProjects(): ProjectEntity[] {
    return [
      new ProjectEntity(
        PROJECT_IDS.portalClientes,
        'Portal de clientes corporativos',
        'Canal centralizado para el seguimiento de solicitudes y avances de cada cliente.',
        'abierto',
        0,
        0,
        0,
        this.createIsoDate('2026-05-18T09:00:00.000Z'),
        null,
      ),
      new ProjectEntity(
        PROJECT_IDS.appInterna,
        'App interna de operaciones',
        'Herramienta para coordinar tareas operativas y responsables entre las areas internas.',
        'abierto',
        0,
        0,
        0,
        this.createIsoDate('2026-05-28T10:30:00.000Z'),
        null,
      ),
      new ProjectEntity(
        PROJECT_IDS.tableroGerencial,
        'Tablero gerencial de indicadores',
        'Vista ejecutiva para revisar avances, bloqueos y rendimiento de los proyectos.',
        'abierto',
        0,
        0,
        0,
        this.createIsoDate('2026-06-02T08:15:00.000Z'),
        null,
      ),
      new ProjectEntity(
        PROJECT_IDS.migracionInventario,
        'Migracion del inventario legado',
        'Traslado controlado de informacion historica desde el sistema anterior.',
        'abierto',
        0,
        0,
        0,
        this.createIsoDate('2026-06-05T11:45:00.000Z'),
        null,
      ),
      new ProjectEntity(
        PROJECT_IDS.automatizacionReportes,
        'Automatizacion de reportes semanales',
        'Generacion automatica de reportes de avance para la gerencia de Innovatech.',
        'cerrado',
        0,
        0,
        0,
        this.createIsoDate('2026-04-22T09:10:00.000Z'),
        this.createIsoDate('2026-05-30T18:20:00.000Z'),
      ),
      new ProjectEntity(
        PROJECT_IDS.centroSoporte,
        'Centro de soporte unificado',
        'Consolidacion de solicitudes internas de soporte en un unico flujo de trabajo.',
        'cerrado',
        0,
        0,
        0,
        this.createIsoDate('2026-03-12T08:50:00.000Z'),
        this.createIsoDate('2026-04-29T17:00:00.000Z'),
      ),
    ];
  }

  private createIsoDate(value: string): string {
    return new Date(value).toISOString();
  }
}
