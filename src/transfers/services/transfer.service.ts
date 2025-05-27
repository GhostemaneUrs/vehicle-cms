import {
  Injectable,
  Scope,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

import { DataSource, Repository, QueryRunner, In } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { Transfer } from '../../transfers/entities/transfer.entity';
import {
  CreateTransferDto,
  UpdateTransferDto,
  ReadTransferDto,
} from '../dto/transfer.dto';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { User } from '../../auth/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { Organizational } from '../../organizational/entities/organizational.entity';
import { TENANT_CONNECTION } from '../../database/common/database.tokens';

@Injectable({ scope: Scope.REQUEST })
export class TransfersService {
  private readonly transferRepository: Repository<Transfer>;

  constructor(
    @Inject(TENANT_CONNECTION)
    private readonly dataSource: DataSource,
  ) {
    this.transferRepository = this.dataSource.getRepository(Transfer);
  }

  async findAllForUser(user: User): Promise<ReadTransferDto[]> {
    // recarga al user con sus relaciones de proyectos y unidades
    const userEntity = await this.dataSource.getRepository(User).findOne({
      where: { id: user.id },
      relations: ['projects', 'organizational'],
    });

    if (!userEntity) throw new NotFoundException('User not found');

    const projectIds = userEntity.projects.map((p) => p.id);
    const ouIds = userEntity.organizational.map((ou) => ou.id);

    const transfers = await this.transferRepository.find({
      where: {
        project: { id: In(projectIds) },
        organizational: { id: In(ouIds) },
      },
      relations: [
        'vehicle',
        'client',
        'transmitter',
        'project',
        'organizational',
      ],
      order: { createdAt: 'DESC' },
    });

    return transfers.map((t) => plainToClass(ReadTransferDto, t));
  }

  /**
   * Crea una nueva transferencia validando accesos.
   */
  async create(dto: CreateTransferDto, user: User): Promise<ReadTransferDto> {
    const qr: QueryRunner = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      // 1) Validar que user pertenece al project y organizationalUnit
      const userEntity = await qr.manager.findOne(User, {
        where: { id: user.id },
        relations: ['projects', 'organizational'],
      });
      if (!userEntity) throw new NotFoundException('User not found');

      if (
        !userEntity.projects.some((p) => p.id === dto.projectId) ||
        !userEntity.organizational.some((ou) => ou.id === dto.organizationalId)
      ) {
        throw new ForbiddenException(
          'You do not belong to that project or organizational unit',
        );
      }

      // 2) Cargar entidades relacionadas
      const vehicle = await qr.manager.findOne(Vehicle, {
        where: { id: dto.vehicleId },
      });
      if (!vehicle) throw new NotFoundException('Vehicle not found');

      const client = await qr.manager.findOne(User, {
        where: { id: dto.clientId },
      });
      if (!client) throw new NotFoundException('Client not found');

      const transmitter = await qr.manager.findOne(User, {
        where: { id: dto.transmitterId },
      });
      if (!transmitter) throw new NotFoundException('Transmitter not found');

      const project = await qr.manager.findOne(Project, {
        where: { id: dto.projectId },
      });
      if (!project) throw new NotFoundException('Project not found');

      const ou = await qr.manager.findOne(Organizational, {
        where: { id: dto.organizationalId },
      });
      if (!ou) throw new NotFoundException('Organizational Unit not found');

      // 3) Crear y guardar la transferencia
      const transfer = qr.manager.create(Transfer, {
        type: dto.type,
        vehicle,
        client,
        transmitter,
        project,
        organizational: ou,
        createdBy: user.id, // si tienes ese campo en tu entidad
      });

      const saved = await qr.manager.save(Transfer, transfer);

      await qr.commitTransaction();
      return plainToClass(ReadTransferDto, saved);
    } catch (err) {
      await qr.rollbackTransaction();
      if (
        err instanceof NotFoundException ||
        err instanceof ForbiddenException ||
        err instanceof BadRequestException
      ) {
        throw err;
      }
      throw new BadRequestException(err.message);
    } finally {
      await qr.release();
    }
  }

  /**
   * Actualiza una transferencia existente, con mismas validaciones
   */
  async update(
    id: string,
    dto: UpdateTransferDto,
    user: User,
  ): Promise<ReadTransferDto> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const existing = await qr.manager.findOne(Transfer, {
        where: { id },
        relations: ['project', 'organizationalUnit'],
      });
      if (!existing) throw new NotFoundException('Transfer not found');

      // Validar acceso al proyecto/unidad original y a los nuevos
      const userEntity = await qr.manager.findOne(User, {
        where: { id: user.id },
        relations: ['projects', 'organizational'],
      });
      if (!userEntity) throw new NotFoundException('User not found');

      const belongsToOld =
        userEntity.projects.some((p) => p.id === existing.project.id) &&
        userEntity.organizational.some(
          (ou) => ou.id === existing.organizational.id,
        );
      const belongsToNew =
        userEntity.projects.some((p) => p.id === dto.projectId) &&
        userEntity.organizational.some((ou) => ou.id === dto.organizationalId);

      if (!belongsToOld || !belongsToNew) {
        throw new ForbiddenException(
          'You do not have access to the original or the new project/organizational unit',
        );
      }

      // Aplicar cambios permitidos
      existing.type = dto.type ?? existing.type;

      if (dto.projectId !== existing.project.id) {
        const project = await qr.manager.findOne(Project, {
          where: { id: dto.projectId },
        });
        if (!project) throw new NotFoundException('Project not found');
        existing.project = project;
      }
      if (dto.organizationalId !== existing.organizational.id) {
        const ou = await qr.manager.findOne(Organizational, {
          where: { id: dto.organizationalId },
        });
        if (!ou) throw new NotFoundException('Organizational Unit not found');
        existing.organizational = ou;
      }

      const saved = await qr.manager.save(Transfer, existing);
      await qr.commitTransaction();
      return plainToClass(ReadTransferDto, saved);
    } catch (err) {
      await qr.rollbackTransaction();
      if (
        err instanceof NotFoundException ||
        err instanceof ForbiddenException ||
        err instanceof BadRequestException
      ) {
        throw err;
      }
      throw new BadRequestException(err.message);
    } finally {
      await qr.release();
    }
  }

  async remove(id: string, user: User): Promise<void> {
    const existing = await this.transferRepository.findOne({
      where: { id },
      relations: ['project', 'organizational'],
    });

    if (!existing) throw new NotFoundException('Transfer not found');

    const userEntity = await this.dataSource.getRepository(User).findOne({
      where: { id: user.id },
      relations: ['organizational'],
    });

    if (
      !userEntity ||
      !userEntity.organizational.some(
        (ou) => ou.id === existing.organizational.id,
      )
    ) {
      throw new ForbiddenException(
        'You do not have access to delete this transfer',
      );
    }

    await this.transferRepository.remove(existing);
  }
}
