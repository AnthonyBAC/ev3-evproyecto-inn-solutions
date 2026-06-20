// Entidad Project — representa un proyecto con sus métricas y fechas
import { ProjectStatus } from '../../types/project-status/project-status.type';

export class ProjectEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public status: ProjectStatus,
    public progress: number,
    public taskCount: number,
    public completedTaskCount: number,
    public readonly createdAt: string,
    public closedAt: string | null,
  ) {}
}
