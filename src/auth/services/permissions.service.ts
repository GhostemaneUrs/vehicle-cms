import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { TENANT_CONNECTION } from '../../database/common/database.tokens';
import { Permission } from '../entities/permissions.entity';
import {
  CreatePermissionDto,
  ReadPermissionDto,
  UpdatePermissionDto,
} from '../dtos/permission.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class PermissionsService {
  private readonly permRepo = this.dataSource.getRepository(Permission);

  constructor(
    @Inject(TENANT_CONNECTION) private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<ReadPermissionDto[]> {
    const perms = await this.permRepo.find();
    return perms.map((p) => plainToClass(ReadPermissionDto, p));
  }

  async findOne(id: string): Promise<ReadPermissionDto> {
    const p = await this.permRepo.findOne({ where: { id } });
    if (!p) throw new NotFoundException(`Permission ${id} not found`);
    return plainToClass(ReadPermissionDto, p);
  }

  async create(data: CreatePermissionDto): Promise<ReadPermissionDto> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const exists = await queryRunner.manager.findOne(Permission, {
        where: { name: data.name },
      });
      if (exists)
        throw new ConflictException(`Permission ${data.name} already exists`);

      const p = queryRunner.manager.create(Permission, data);
      const saved = await queryRunner.manager.save(p);
      await queryRunner.commitTransaction();
      return plainToClass(ReadPermissionDto, saved);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof ConflictException) throw err;
      throw new InternalServerErrorException(err.message);
    } finally {
      await queryRunner.release();
    }
  }

  async update(data: UpdatePermissionDto): Promise<ReadPermissionDto> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const p = await queryRunner.manager.findOne(Permission, {
        where: { id: data.id },
      });

      if (!p) throw new NotFoundException(`Permission ${data.id} not found`);

      if (data.name) p.name = data.name;

      if (data.description !== undefined) p.description = data.description;

      const saved = await queryRunner.manager.save(p);

      await queryRunner.commitTransaction();

      return plainToClass(ReadPermissionDto, saved);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException(err.message);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const p = await queryRunner.manager.findOne(Permission, {
        where: { id },
      });

      if (!p) throw new NotFoundException(`Permission ${id} not found`);

      await queryRunner.manager.remove(p);
      await queryRunner.commitTransaction();

      return { message: 'Permission deleted' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException(err.message);
    } finally {
      await queryRunner.release();
    }
  }
}
