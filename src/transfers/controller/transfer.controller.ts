import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TransferService } from '../services/transfer.service';
import {
  CreateTransferDto,
  ReadTransferDto,
  UpdateTransferDto,
} from '../dto/transfer.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { USER_INFO } from '../../auth/decorators/user.decorator';
import { User } from '../../auth/entities/user.entity';
import {
  ApiHeader,
  ApiNoContentResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { TransferPermissions } from '../../auth/enums/transfer-permissions.enum';
import { Permissions } from '../../auth/decorators/permission.decorator';

@Controller('transfers')
@UseGuards(JwtAuthGuard)
@ApiHeader({
  name: 'x-tenant-id',
  description: 'Tenant identifier (schema name)',
  required: true,
})
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all transfers' })
  @Permissions(TransferPermissions.VIEW)
  @ApiResponse({
    status: 200,
    description: 'Returns all transfers',
    type: [ReadTransferDto],
  })
  async findAll(@USER_INFO() user: User): Promise<ReadTransferDto[]> {
    console.log('🚀 ~ TransferController ~ findAll ~ user:', user);
    return this.transferService.findAll(user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a transfer by id' })
  @Permissions(TransferPermissions.VIEW)
  @ApiResponse({
    status: 200,
    description: 'Returns a transfer',
    type: ReadTransferDto,
  })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @USER_INFO() user: User,
  ): Promise<ReadTransferDto> {
    return this.transferService.findOne(id, user);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a transfer' })
  @Permissions(TransferPermissions.CREATE)
  async create(
    @Body() dto: CreateTransferDto,
    @USER_INFO() user: User,
  ): Promise<ReadTransferDto> {
    const response = await this.transferService.create(dto, user);
    console.log('🚀 ~ TransferController ~ response:', response);
    return response;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a transfer' })
  @Permissions(TransferPermissions.EDIT)
  @ApiResponse({
    status: 200,
    description: 'Returns the updated transfer',
    type: ReadTransferDto,
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTransferDto,
    @USER_INFO() user: User,
  ): Promise<ReadTransferDto> {
    return this.transferService.update(id, dto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a transfer' })
  @Permissions(TransferPermissions.DELETE)
  @ApiNoContentResponse({
    description: 'Transfer deleted successfully',
  })
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @USER_INFO() user: User,
  ): Promise<{ message: string }> {
    return this.transferService.remove(id, user);
  }
}
