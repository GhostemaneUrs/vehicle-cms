import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permissions } from '../../common/permission.decorator';
import { TransfersService } from '../services/transfer.service';
import {
  CreateTransferDto,
  UpdateTransferDto,
  ReadTransferDto,
} from '../dto/transfer.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('transfers')
export class TransfersController {
  constructor(private readonly transferService: TransfersService) {}

  @Get()
  @Permissions('view_transfers')
  getAll(@Req() req): Promise<ReadTransferDto[]> {
    return this.transferService.findAllForUser(req.user);
  }

  @Post()
  @Permissions('create_transfers')
  @HttpCode(HttpStatus.CREATED)
  create(@Req() req, @Body() dto: CreateTransferDto): Promise<ReadTransferDto> {
    return this.transferService.create(dto, req.user);
  }

  @Put(':id')
  @Permissions('edit_transfers')
  update(
    @Param('id') id: string,
    @Req() req,
    @Body() dto: UpdateTransferDto,
  ): Promise<ReadTransferDto> {
    return this.transferService.update(id, dto, req.user);
  }

  @Delete(':id')
  @Permissions('delete_transfers')
  remove(@Param('id') id: string, @Req() req): Promise<void> {
    return this.transferService.remove(id, req.user);
  }
}
