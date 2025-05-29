import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserService } from '../services/user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  ReadUserDto,
  AssignRoleDto,
} from '../dtos/user.dto';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

@ApiTags('Users')
@Controller('users')
@ApiHeader({
  name: 'x-tenant-id',
  description: 'Tenant identifier (schema name)',
  required: true,
})
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all users' })
  @ApiOkResponse({ type: ReadUserDto, isArray: true })
  async findAll(): Promise<ReadUserDto[]> {
    return this.userService.findAll();
  }

  @Get(':username')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a user by username' })
  @ApiOkResponse({ type: ReadUserDto })
  async findOne(@Param('username') username: string): Promise<User> {
    const response = await this.userService.findByUsername(username);
    return {
      ...response,
      passwordHash: undefined,
      refreshTokenHash: undefined,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({ type: ReadUserDto })
  async create(@Body() dto: CreateUserDto): Promise<ReadUserDto> {
    return this.userService.create(dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a user by id' })
  @ApiOkResponse({ type: ReadUserDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<ReadUserDto> {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user by id' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.userService.remove(id);
  }

  @Post(':id/roles')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign a role to a user' })
  @ApiOkResponse({ type: Object })
  assignRole(@Param('id') id: string, @Body() data: AssignRoleDto) {
    return this.userService.assignRole(id, data);
  }
}
