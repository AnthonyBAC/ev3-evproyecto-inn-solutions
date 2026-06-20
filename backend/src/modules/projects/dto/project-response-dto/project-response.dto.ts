// DTO de respuesta de proyecto — todos los campos que devuelve la API al consultar un proyecto
import { ProjectStatus } from '../../types/project-status/project-status.type';

export class ProjectResponseDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly status: ProjectStatus,
    public readonly progress: number,
    public readonly taskCount: number,
    public readonly completedTaskCount: number,
    public readonly createdAt: string,
    public readonly closedAt: string | null,
  ) {}
}
