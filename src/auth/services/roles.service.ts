import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { DataSource, QueryRunner, In } from 'typeorm';

import { Role } from '../entities/roles.entity';
import { Permission } from '../entities/permissions.entity';
import { CreateRoleDto } from '../dtos/roles.dto';
import { UpdateRoleDto } from '../dtos/roles.dto';
import { ReadRoleDto } from '../dtos/roles.dto';
import { plainToClass } from 'class-transformer';
import { TENANT_CONNECTION } from '../../database/common/database.tokens';

@Injectable()
export class RolesService {
  private readonly roleRepo = this.dataSource.getRepository(Role);

  constructor(
    @Inject(TENANT_CONNECTION) private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<ReadRoleDto[]> {
    const roles = await this.roleRepo.find();
    return roles.map((r) => plainToClass(ReadRoleDto, r));
  }

  async findOne(id: string): Promise<ReadRoleDto> {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) throw new NotFoundException(`Role ${id} not found`);
    return plainToClass(ReadRoleDto, role);
  }

  async create(dto: CreateRoleDto): Promise<ReadRoleDto> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { permissionIds, ...data } = dto;

      const role = queryRunner.manager.create(Role, data);

      if (permissionIds?.length) {
        const perms = await queryRunner.manager.findBy(Permission, {
          id: In(permissionIds),
        });
        if (perms.length !== permissionIds.length) {
          throw new BadRequestException(`Some permissions not found`);
        }
        role.permissions = perms;
      }

      const saved = await queryRunner.manager.save(role);
      await queryRunner.commitTransaction();
      return plainToClass(ReadRoleDto, saved);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof BadRequestException) throw err;
      throw new InternalServerErrorException(err.message);
    } finally {
      await queryRunner.release();
    }
  }

  async update(dto: UpdateRoleDto): Promise<ReadRoleDto> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const role = await queryRunner.manager.findOne(Role, {
        where: { id: dto.id },
      });
      if (!role) throw new NotFoundException(`Role ${dto.id} not found`);

      if (dto.name) role.name = dto.name;
      if (dto.description !== undefined) role.description = dto.description;

      if (dto.permissionIds !== undefined) {
        const perms = await queryRunner.manager.findBy(Permission, {
          id: In(dto.permissionIds),
        });
        if (perms.length !== dto.permissionIds.length) {
          throw new BadRequestException(`Some permissions not found`);
        }
        role.permissions = perms;
      }

      const saved = await queryRunner.manager.save(role);
      await queryRunner.commitTransaction();
      return plainToClass(ReadRoleDto, saved);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (
        err instanceof NotFoundException ||
        err instanceof BadRequestException
      ) {
        throw err;
      }
      throw new InternalServerErrorException(err.message);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const role = await queryRunner.manager.findOne(Role, { where: { id } });
      if (!role) throw new NotFoundException(`Role ${id} not found`);
      await queryRunner.manager.remove(role);
      await queryRunner.commitTransaction();
      return { message: 'Role deleted' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException(err.message);
    } finally {
      await queryRunner.release();
    }
  }
}
