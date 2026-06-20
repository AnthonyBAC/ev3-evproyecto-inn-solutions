// Módulo raíz de NestJS — importa los 3 módulos de negocio: system-status, projects, tasks
import { Module } from '@nestjs/common';
import { ProjectsModule } from './modules/projects/projects.module';
import { SystemStatusModule } from './modules/system-status/system-status.module';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [SystemStatusModule, ProjectsModule, TasksModule],
})
export class AppModule {}
