// Controller REST de proyectos — expone GET / POST / PATCH bajo /api/projects
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateProjectDto } from '../../dto/create-project-dto/create-project.dto';
import { ProjectResponseDto } from '../../dto/project-response-dto/project-response.dto';
import { ProjectsService } from '../../services/projects/projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAllProjects(): ProjectResponseDto[] {
    return this.projectsService.findAllProjects();
  }

  @Post()
  createProject(
    @Body() createProjectDto: CreateProjectDto,
  ): ProjectResponseDto {
    return this.projectsService.createProject(createProjectDto);
  }

  @Patch(':projectId/close')
  closeProject(@Param('projectId') projectId: string): ProjectResponseDto {
    return this.projectsService.closeProject(projectId);
  }
}
