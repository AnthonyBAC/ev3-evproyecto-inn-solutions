// DTO de respuesta de tarea — incluye el nombre del proyecto además de los datos de la tarea
import { TaskStatus } from '../../types/task-status/task-status.type';

export class TaskResponseDto {
  constructor(
    public readonly id: string,
    public readonly projectId: string,
    public readonly projectName: string,
    public readonly title: string,
    public readonly description: string,
    public readonly assignee: string,
    public readonly status: TaskStatus,
    public readonly createdAt: string,
  ) {}
}
