// Controller REST de tareas — expone GET / POST / PATCH bajo /api/tasks
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateTaskDto } from '../../dto/create-task-dto/create-task.dto';
import { TaskResponseDto } from '../../dto/task-response-dto/task-response.dto';
import { UpdateTaskStatusDto } from '../../dto/update-task-status-dto/update-task-status.dto';
import { TasksService } from '../../services/tasks/tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAllTasks(): TaskResponseDto[] {
    return this.tasksService.findAllTasks();
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): TaskResponseDto {
    return this.tasksService.createTask(createTaskDto);
  }

  @Patch(':taskId/status')
  updateTaskStatus(
    @Param('taskId') taskId: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): TaskResponseDto {
    return this.tasksService.updateTaskStatus(taskId, updateTaskStatusDto);
  }
}
