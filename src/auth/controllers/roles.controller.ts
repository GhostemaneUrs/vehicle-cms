import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import { RolesService } from '../services/roles.service';
import { ReadRoleDto, CreateRoleDto, UpdateRoleDto } from '../dtos/roles.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Roles')
@Controller('roles')
@ApiHeader({
  name: 'x-tenant-id',
  description: 'Tenant identifier (schema name)',
  required: true,
})
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private readonly svc: RolesService) {}

  @Get()
  @ApiOperation({ summary: 'List all roles' })
  @ApiOkResponse({ type: ReadRoleDto, isArray: true })
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({ type: ReadRoleDto })
  @ApiNotFoundResponse()
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.svc.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiBody({ type: CreateRoleDto })
  @ApiCreatedResponse({ type: ReadRoleDto })
  @ApiBadRequestResponse()
  create(@Body() dto: CreateRoleDto) {
    return this.svc.create(dto);
  }

  @Put()
  @ApiOperation({ summary: 'Update an existing role' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiOkResponse({ type: ReadRoleDto })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  update(@Body() dto: UpdateRoleDto) {
    return this.svc.update(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a role' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiNoContentResponse({
    description: 'Role deleted successfully',
  })
  @ApiNotFoundResponse()
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.svc.remove(id);
  }
}
