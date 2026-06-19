import { TaskStatus } from '../../types/task-status/task-status.type';

export class TaskEntity {
  constructor(
    public readonly id: string,
    public readonly projectId: string,
    public title: string,
    public description: string,
    public assignee: string,
    public status: TaskStatus,
    public readonly createdAt: string,
  ) {}
}
