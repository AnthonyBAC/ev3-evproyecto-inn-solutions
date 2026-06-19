import { Module } from '@nestjs/common';
import { ProjectsModule } from '../projects/projects.module';
import { TasksController } from './controllers/tasks/tasks.controller';
import { TasksService } from './services/tasks/tasks.service';

@Module({
  imports: [ProjectsModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
