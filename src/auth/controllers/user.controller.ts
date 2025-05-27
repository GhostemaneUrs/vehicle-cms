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
import { CreateUserDto, UpdateUserDto, ReadUserDto } from '../dtos/user.dto';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';

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
  async findOne(@Param('username') username: string): Promise<ReadUserDto> {
    return this.userService.findOne(username);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({ type: ReadUserDto })
  async create(@Body() dto: CreateUserDto): Promise<ReadUserDto> {
    return this.userService.create(dto);
  }

  @Put(':username')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a user by username' })
  @ApiOkResponse({ type: ReadUserDto })
  async update(
    @Param('username') username: string,
    @Body() dto: UpdateUserDto,
  ): Promise<ReadUserDto> {
    return this.userService.update(username, dto);
  }

  @Delete(':username')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user by username' })
  async remove(@Param('username') username: string): Promise<void> {
    await this.userService.remove(username);
  }
}
