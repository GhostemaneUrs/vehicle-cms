import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiBody,
} from '@nestjs/swagger';
import { TenancyService } from '../services/tenancy.service';
import {
  CreateTenantDto,
  ReadTenantDto,
  UpdateTenantDto,
} from '../dtos/tenancy.dto';
import { Public } from '../../common/public.decorator';
import { plainToClass } from 'class-transformer';

@ApiTags('Tenancy')
@Controller('tenancy')
export class TenancyController {
  constructor(private readonly tenancyService: TenancyService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List all tenants' })
  @ApiOkResponse({ type: ReadTenantDto, isArray: true })
  async getAll(): Promise<ReadTenantDto[]> {
    const response = await this.tenancyService.findAll();

    return plainToClass(ReadTenantDto, response, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tenant by ID' })
  @ApiOkResponse({ type: ReadTenantDto })
  @ApiNotFoundResponse({ description: 'Tenant not found' })
  getOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<ReadTenantDto> {
    return this.tenancyService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new tenant' })
  @ApiBody({ type: CreateTenantDto })
  @ApiCreatedResponse({ type: ReadTenantDto })
  @ApiBadRequestResponse({ description: 'Invalid input or name exists' })
  create(@Body() dto: CreateTenantDto): Promise<ReadTenantDto> {
    return this.tenancyService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing tenant' })
  @ApiBody({ type: UpdateTenantDto })
  @ApiOkResponse({ type: ReadTenantDto })
  @ApiNotFoundResponse({ description: 'Tenant not found' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateTenantDto,
  ): Promise<ReadTenantDto> {
    return this.tenancyService.update(id, dto);
  }
}
