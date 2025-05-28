// src/projects/projects.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  CreateProjectDto,
  ReadProjectDto,
  UpdateProjectDto,
} from '../dto/project.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '../../auth/entities/user.entity';
import { ProjectService } from '../services/project.service';
import { USER_INFO } from '../../auth/decorators/user.decorator';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('projects')
@ApiHeader({
  name: 'x-tenant-id',
  description: 'Tenant identifier (schema name)',
  required: true,
})
export class ProjectsController {
  constructor(private readonly projectsService: ProjectService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new project' })
  @ApiCreatedResponse({ type: ReadProjectDto })
  create(@Body() dto: CreateProjectDto, @USER_INFO() user: User) {
    return this.projectsService.create(dto, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all projects' })
  @ApiOkResponse({ type: ReadProjectDto, isArray: true })
  findAll(@USER_INFO() user: User) {
    return this.projectsService.findAll(user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a project by id' })
  @ApiOkResponse({ type: ReadProjectDto })
  findOne(@Param('id') id: string, @USER_INFO() user: User) {
    return this.projectsService.findOne(id, user);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a project by id' })
  @ApiOkResponse({ type: ReadProjectDto })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @USER_INFO() user: User,
  ) {
    return this.projectsService.update(id, dto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a project by id' })
  @ApiNoContentResponse()
  remove(@Param('id') id: string, @USER_INFO() user: User) {
    return this.projectsService.remove(id, user);
  }
}
