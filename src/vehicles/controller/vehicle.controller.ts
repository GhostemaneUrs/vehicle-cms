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
import { VehicleService } from '../services/vehicle.service';
import {
  CreateVehicleDto,
  UpdateVehicleDto,
  ReadVehicleDto,
} from '../dto/vehicle.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('vehicles')
@ApiHeader({
  name: 'x-tenant-id',
  description: 'Tenant identifier (schema name)',
  required: true,
})
@UseGuards(JwtAuthGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new vehicle' })
  @ApiCreatedResponse({ type: ReadVehicleDto })
  async create(
    @Req() req,
    @Body() dto: CreateVehicleDto,
  ): Promise<ReadVehicleDto> {
    return this.vehicleService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all vehicles' })
  @ApiOkResponse({ type: [ReadVehicleDto] })
  getAll(): Promise<ReadVehicleDto[]> {
    return this.vehicleService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a vehicle by id' })
  @ApiOkResponse({ type: ReadVehicleDto })
  getById(@Param('id') id: string): Promise<ReadVehicleDto> {
    return this.vehicleService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a vehicle by id' })
  @ApiOkResponse({ type: ReadVehicleDto })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateVehicleDto,
  ): Promise<ReadVehicleDto> {
    return this.vehicleService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a vehicle by id' })
  @ApiNoContentResponse({
    description: 'Vehicle deleted successfully',
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.vehicleService.remove(id);
  }
}
