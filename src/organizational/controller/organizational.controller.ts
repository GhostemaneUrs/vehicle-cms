import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrganizationalService } from '../services/organizational.service';
import {
  AssignUserDto,
  CreateOrganizationalDto,
  ReadOrganizationalDto,
  UpdateOrganizationalDto,
} from '../dto/organizational.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { USER_INFO } from '../../auth/decorators/user.decorator';
import { User } from '../../auth/entities/user.entity';
import { ApiHeader, ApiResponse } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import { ResourceAccess } from '../../auth/decorators/resource-access.decorator';

@UseGuards(JwtAuthGuard)
@Controller('organizational')
@ApiHeader({
  name: 'x-tenant-id',
  description: 'Tenant identifier (schema name)',
  required: true,
})
export class OrganizationalController {
  constructor(private readonly organizationalService: OrganizationalService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all organizational units' })
  @ResourceAccess({ projectProp: 'projectId' })
  @ApiResponse({
    status: 200,
    description: 'Returns all organizational units',
    type: [ReadOrganizationalDto],
  })
  async findAll(): Promise<ReadOrganizationalDto[]> {
    return this.organizationalService.findAll();
  }

  @Get('project/:projectId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all organizational by project id' })
  @ResourceAccess({ projectProp: 'projectId' })
  @ApiResponse({
    status: 200,
    description: 'Returns all organizationals',
    type: [ReadOrganizationalDto],
  })
  async findAllByProjectId(
    @Param('projectId') projectId: string,
  ): Promise<ReadOrganizationalDto[]> {
    return this.organizationalService.findAllByProjectId(projectId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get an organizational by id' })
  @ResourceAccess({ organizationalProp: 'id' })
  @ApiResponse({
    status: 200,
    description: 'Returns an organizational',
    type: ReadOrganizationalDto,
  })
  async findOne(@Param('id') id: string): Promise<ReadOrganizationalDto> {
    return this.organizationalService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an organizational ' })
  @ResourceAccess({ projectProp: 'projectId' })
  @ApiResponse({
    status: 201,
    description: 'Returns the created organizational ',
    type: ReadOrganizationalDto,
  })
  async create(
    @Body() dto: CreateOrganizationalDto,
    @USER_INFO() user: User,
  ): Promise<ReadOrganizationalDto> {
    return this.organizationalService.create(dto, user);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an organizational ' })
  @ResourceAccess({ organizationalProp: 'id' })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated organizational ',
    type: ReadOrganizationalDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateOrganizationalDto,
    @USER_INFO() user: User,
  ): Promise<ReadOrganizationalDto> {
    return this.organizationalService.update(id, dto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an organizational ' })
  @ResourceAccess({ organizationalProp: 'id' })
  @ApiResponse({
    status: 200,
    description: 'Returns a message indicating the organizational  was deleted',
    type: Object,
    schema: {
      properties: {
        message: {
          type: 'string',
          description: 'Response message',
        },
      },
    },
  })
  async remove(
    @Param('id') id: string,
    @USER_INFO() user: User,
  ): Promise<{ message: string }> {
    return this.organizationalService.remove(id, user);
  }

  @Post(':id/users')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign a user to an organizational' })
  @ResourceAccess({ organizationalProp: 'id' })
  @ApiResponse({
    status: 200,
    description:
      'Returns a message indicating the user was assigned to the organizational ',
    type: Object,
    schema: {
      properties: {
        message: {
          type: 'string',
          description: 'Response message',
        },
      },
    },
  })
  async assignUser(
    @Param('id') id: string,
    @Body() data: AssignUserDto,
  ): Promise<{ message: string }> {
    return this.organizationalService.assignUser(id, data);
  }
}
