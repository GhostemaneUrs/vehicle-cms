import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { Tenancy } from '../entities/tenancy.entity';
import {
  CreateTenantDto,
  ReadTenantDto,
  UpdateTenantDto,
} from '../dtos/tenancy.dto';

@Injectable()
export class TenancyService {
  constructor(
    @InjectRepository(Tenancy)
    private readonly tenancyRepository: Repository<Tenancy>,

    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<ReadTenantDto[]> {
    const tenants = await this.tenancyRepository.find();
    return plainToClass(ReadTenantDto, tenants, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string): Promise<Tenancy> {
    const t = await this.tenancyRepository.findOneBy({ id });
    if (!t) throw new NotFoundException(`Tenant ${id} not found`);
    return t;
  }

  async create(dto: CreateTenantDto): Promise<Tenancy> {
    const exists = await this.tenancyRepository.findOneBy({ name: dto.name });
    if (exists) throw new BadRequestException('Tenant name already exists');

    const saved = await this.tenancyRepository.save(
      this.tenancyRepository.create({ name: dto.name }),
    );

    const schema = `t_${saved.name}`;
    await this.dataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);

    return saved;
  }

  async update(id: string, dto: UpdateTenantDto): Promise<Tenancy> {
    const tenant = await this.findOne(id);
    tenant.name = dto.name;
    return this.tenancyRepository.save(tenant);
  }
}
