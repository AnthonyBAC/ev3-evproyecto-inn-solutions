// DTO para crear tarea — requiere projectId, title, description y assignee
export class CreateTaskDto {
  projectId!: string;
  title!: string;
  description!: string;
  assignee!: string;
}
