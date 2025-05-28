import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Transfer } from '../entities/transfer.entity';
import { DataSource, In, QueryRunner, Repository } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Organizational } from '../../organizational/entities/organizational.entity';
import { TENANT_CONNECTION } from '../../database/common/database.tokens';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { User } from '../../auth/entities/user.entity';
import {
  CreateTransferDto,
  ReadTransferDto,
  UpdateTransferDto,
} from '../dto/transfer.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TransferService {
  private readonly userRepository: Repository<User>;
  private readonly vehicleRepository: Repository<Vehicle>;
  private readonly projectRepository: Repository<Project>;
  private readonly transferRepository: Repository<Transfer>;
  private readonly organizationalRepository: Repository<Organizational>;

  constructor(
    @Inject(TENANT_CONNECTION)
    private readonly dataSource: DataSource,
  ) {
    this.vehicleRepository = this.dataSource.getRepository(Vehicle);
    this.projectRepository = this.dataSource.getRepository(Project);
    this.transferRepository = this.dataSource.getRepository(Transfer);
    this.organizationalRepository =
      this.dataSource.getRepository(Organizational);
  }

  async findAll(user: User): Promise<ReadTransferDto[]> {
    try {
      const userInfo = await this.userRepository.findOne({
        where: {
          id: user.id,
        },
        relations: ['organizational', 'projects'],
      });

      if (!userInfo) {
        throw new NotFoundException('User not found');
      }

      const { organizational, projects } = userInfo;
      const projectIds = projects.map((project) => project.id);
      const organizationalIds = organizational.map((org) => org.id);

      const transfers = await this.transferRepository.find({
        where: {
          project: {
            id: In(projectIds),
          },
          organizational: {
            id: In(organizationalIds),
          },
        },
        relations: [
          'vehicle',
          'project',
          'client',
          'transmitter',
          'organizational',
        ],
      });

      return transfers.map((transfer) =>
        plainToClass(ReadTransferDto, transfer),
      );
    } catch (error) {
      console.log('🚀 ~ TransferService ~ findAll ~ error:', error);
      throw new BadRequestException(error);
    }
  }

  async findOne(id: string, user: User): Promise<ReadTransferDto> {
    try {
      const userInfo = await this.userRepository.findOne({
        where: {
          id: user.id,
        },
        relations: ['organizational', 'projects'],
      });

      const transfer = await this.transferRepository.findOne({
        where: { id },
        relations: [
          'vehicle',
          'client',
          'transmitter',
          'project',
          'organizational',
        ],
      });

      if (!transfer) throw new NotFoundException('Transfer not found');

      if (
        !userInfo.projects.some((p) => p.id === transfer.project.id) ||
        !userInfo.organizational.some(
          (o) => o.id === transfer.organizational.id,
        )
      ) {
        throw new ForbiddenException(`Access denied to this transfer`);
      }

      return plainToClass(ReadTransferDto, transfer);
    } catch (error) {
      console.log('🚀 ~ TransferService ~ findOne ~ error:', error);
      throw new BadRequestException(error);
    }
  }

  async create(data: CreateTransferDto, user: User): Promise<ReadTransferDto> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const project = await queryRunner.manager.findOne(Project, {
        where: { id: data.projectId },
        relations: ['users', 'organizational'],
      });

      if (!project) throw new NotFoundException('Project not found');

      if (!project.users.some((u) => u.id === user.id)) {
        throw new ForbiddenException(
          `You are not allowed to create a transfer in this project ${project.name}`,
        );
      }

      const organizational = await queryRunner.manager.findOne(Organizational, {
        where: { id: data.organizationalId },
        relations: ['users'],
      });

      if (!organizational)
        throw new NotFoundException('Organizational not found');

      if (!project.organizational.some((o) => o.id === organizational.id)) {
        throw new ForbiddenException(
          `You are not allowed to create a transfer in this organizational ${organizational.name}`,
        );
      }

      if (!organizational.users.some((u) => u.id === user.id)) {
        throw new ForbiddenException(
          `You are not allowed to create a transfer in this organizational ${organizational.name}`,
        );
      }

      const vehicle = await queryRunner.manager.findOne(Vehicle, {
        where: { id: data.vehicleId },
      });

      if (!vehicle) throw new NotFoundException('Vehicle not found');

      const client = await queryRunner.manager.findOne(User, {
        where: { id: data.clientId },
      });

      if (!client) throw new NotFoundException('Client not found');

      const transmitter = await queryRunner.manager.findOne(User, {
        where: { id: data.transmitterId },
      });

      if (!transmitter) throw new NotFoundException('Transmitter not found');

      const transfer = new Transfer();
      transfer.type = data.type;
      transfer.vehicle = vehicle;
      transfer.client = client;
      transfer.transmitter = transmitter;
      transfer.project = project;
      transfer.organizational = organizational;

      await queryRunner.manager.save(transfer);

      await queryRunner.commitTransaction();

      return plainToClass(ReadTransferDto, transfer);
    } catch (error) {
      console.log('🚀 ~ TransferService ~ create ~ error:', error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: string,
    data: UpdateTransferDto,
    user: User,
  ): Promise<ReadTransferDto> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const userInfo = await this.userRepository.findOne({
        where: {
          id: user.id,
        },
        relations: ['organizational', 'projects'],
      });

      const transfer = await queryRunner.manager.findOne(Transfer, {
        where: { id },
        relations: [
          'project',
          'organizational',
          'vehicle',
          'client',
          'transmitter',
        ],
      });

      if (!transfer) throw new NotFoundException('Transfer not found');

      if (!userInfo.projects.some((p) => p.id === transfer.project.id)) {
        throw new ForbiddenException(
          `You are not allowed to update this transfer ${transfer.id}`,
        );
      }

      if (
        !userInfo.organizational.some(
          (o) => o.id === transfer.organizational.id,
        )
      ) {
        throw new ForbiddenException(
          `You are not allowed to update this transfer ${transfer.id}`,
        );
      }

      if (data.projectId !== transfer.project.id) {
        const project = await queryRunner.manager.findOne(Project, {
          where: { id: data.projectId },
          relations: ['users'],
        });

        if (!project) throw new NotFoundException('Project not found');

        if (!project.users.some((u) => u.id === user.id)) {
          throw new ForbiddenException(
            `You are not allowed to update this transfer ${transfer.id}`,
          );
        }

        transfer.project = project;
      }

      if (data.organizationalId !== transfer.organizational.id) {
        const organizational = await queryRunner.manager.findOne(
          Organizational,
          {
            where: { id: data.organizationalId },
            relations: ['users', 'project'],
          },
        );

        if (!organizational)
          throw new NotFoundException('Organizational not found');

        if (!organizational.users.some((u) => u.id === user.id)) {
          throw new ForbiddenException(
            `You are not allowed to update this transfer ${transfer.id}`,
          );
        }

        if (organizational.project.id !== transfer.project.id) {
          throw new ForbiddenException(
            `You are not allowed to update this transfer ${transfer.id}`,
          );
        }

        transfer.organizational = organizational;
      }

      if (data.type !== transfer.type) {
        transfer.type = data.type;
      }

      if (data.vehicleId !== transfer.vehicle.id) {
        const vehicle = await queryRunner.manager.findOne(Vehicle, {
          where: { id: data.vehicleId },
        });

        if (!vehicle) throw new NotFoundException('Vehicle not found');

        transfer.vehicle = vehicle;
      }

      if (data.clientId !== transfer.client.id) {
        const client = await queryRunner.manager.findOne(User, {
          where: { id: data.clientId },
        });

        if (!client) throw new NotFoundException('Client not found');

        transfer.client = client;
      }

      if (data.transmitterId !== transfer.transmitter.id) {
        const transmitter = await queryRunner.manager.findOne(User, {
          where: { id: data.transmitterId },
        });

        if (!transmitter) throw new NotFoundException('Transmitter not found');

        transfer.transmitter = transmitter;
      }

      await queryRunner.manager.save(transfer);

      await queryRunner.commitTransaction();

      return plainToClass(ReadTransferDto, transfer);
    } catch (error) {
      console.log('🚀 ~ TransferService ~ create ~ error:', error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string, user: User): Promise<{ message: string }> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const userInfo = await this.userRepository.findOne({
        where: {
          id: user.id,
        },
        relations: ['organizational', 'projects'],
      });

      if (!userInfo) throw new NotFoundException('User not found');

      const transfer = await queryRunner.manager.findOne(Transfer, {
        where: { id },
        relations: ['project', 'organizational'],
      });

      if (!transfer) throw new NotFoundException('Transfer not found');

      if (!userInfo.projects.some((p) => p.id === transfer.project.id)) {
        throw new ForbiddenException(
          `You are not allowed to delete this transfer ${transfer.id}`,
        );
      }

      if (
        !userInfo.organizational.some(
          (o) => o.id === transfer.organizational.id,
        )
      ) {
        throw new ForbiddenException(
          `You are not allowed to delete this transfer ${transfer.id}`,
        );
      }

      await queryRunner.manager.remove(Transfer, transfer);

      await queryRunner.commitTransaction();

      return { message: 'Transfer deleted successfully' };
    } catch (error) {
      console.log('🚀 ~ TransferService ~ remove ~ error:', error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error);
    } finally {
      await queryRunner.release();
    }
  }
}
