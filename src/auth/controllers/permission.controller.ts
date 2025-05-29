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
import { PermissionsService } from '../services/permissions.service';
import {
  CreatePermissionDto,
  ReadPermissionDto,
  UpdatePermissionDto,
} from '../dtos/permission.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Permissions')
@Controller('permissions')
@ApiHeader({
  name: 'x-tenant-id',
  description: 'Tenant identifier (schema name)',
  required: true,
})
@UseGuards(JwtAuthGuard)
export class PermissionsController {
  constructor(private readonly svc: PermissionsService) {}

  @Get()
  @ApiOperation({ summary: 'List all permissions' })
  @ApiOkResponse({ type: ReadPermissionDto, isArray: true })
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a permission by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: ReadPermissionDto })
  @ApiNotFoundResponse()
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.svc.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiBody({ type: CreatePermissionDto })
  @ApiCreatedResponse({ type: ReadPermissionDto })
  @ApiBadRequestResponse()
  create(@Body() dto: CreatePermissionDto) {
    return this.svc.create(dto);
  }

  @Put()
  @ApiOperation({ summary: 'Update an existing permission' })
  @ApiBody({ type: UpdatePermissionDto })
  @ApiOkResponse({ type: ReadPermissionDto })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  update(@Body() dto: UpdatePermissionDto) {
    return this.svc.update(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a permission' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({
    description: 'Permission deleted successfully',
  })
  @ApiNotFoundResponse()
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.svc.remove(id);
  }
}
