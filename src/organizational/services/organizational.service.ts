import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Organizational } from '../entities/organizational.entity';
import { Project } from '../../projects/entities/project.entity';
import { TENANT_CONNECTION } from '../../database/common/database.tokens';
import { User } from '../../auth/entities/user.entity';
import {
  AssignUserDto,
  CreateOrganizationalDto,
  ReadOrganizationalDto,
  UpdateOrganizationalDto,
} from '../dto/organizational.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class OrganizationalService {
  private readonly organizationalRepository: Repository<Organizational>;

  constructor(
    @Inject(TENANT_CONNECTION)
    private readonly dataSource: DataSource,
  ) {
    this.organizationalRepository =
      this.dataSource.getRepository(Organizational);
  }

  async findAll(): Promise<ReadOrganizationalDto[]> {
    try {
      const organizational = await this.organizationalRepository.find({
        relations: ['project'],
      });

      return organizational.map((organizational) =>
        plainToClass(ReadOrganizationalDto, organizational),
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllByProjectId(
    projectId: string,
  ): Promise<ReadOrganizationalDto[]> {
    try {
      const organizational = await this.organizationalRepository.find({
        where: {
          project: {
            id: projectId,
          },
        },
        relations: ['project'],
      });

      return organizational.map((organizational) =>
        plainToClass(ReadOrganizationalDto, organizational),
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string): Promise<ReadOrganizationalDto> {
    try {
      const organizational = await this.organizationalRepository.findOne({
        where: { id },
        relations: ['project', 'users'],
      });

      if (!organizational)
        throw new NotFoundException('Organizational not found');

      return plainToClass(ReadOrganizationalDto, organizational);
    } catch (error) {
      console.log('🚀 ~ OrganizationalService ~ findOne ~ error:', error);
      throw new BadRequestException(error.message);
    }
  }

  async create(
    data: CreateOrganizationalDto,
    user: User,
  ): Promise<ReadOrganizationalDto> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const project = await queryRunner.manager.findOne(Project, {
        where: { id: data.projectId },
        relations: ['organizational'],
      });
      console.log('🚀 ~ OrganizationalService ~ project:', project);

      if (!project) throw new NotFoundException('Project not found');

      const existingOrganizational = await queryRunner.manager.findOne(
        Organizational,
        {
          where: {
            name: data.name,
          },
        },
      );

      if (existingOrganizational) {
        throw new BadRequestException(
          'Organizational with this name already exists',
        );
      }

      const organizational = new Organizational();
      organizational.name = data.name;
      organizational.project = project;

      const saved = await queryRunner.manager.save(organizational);

      saved.users = [user];
      await queryRunner.manager.save(saved);
      await queryRunner.commitTransaction();

      return plainToClass(ReadOrganizationalDto, saved);
    } catch (error) {
      console.log('🚀 ~ OrganizationalService ~ create ~ error:', error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: string,
    data: UpdateOrganizationalDto,
    user: User,
  ): Promise<ReadOrganizationalDto> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const organizational = await this.organizationalRepository.findOne({
        where: { id },
        relations: ['project'],
      });

      if (!organizational)
        throw new NotFoundException('Organizational not found');

      if (data.name !== organizational.name) {
        organizational.name = data.name;
        const organizationalWithSameName = await queryRunner.manager.findOne(
          Organizational,
          {
            where: { name: data.name },
          },
        );

        if (organizationalWithSameName) {
          throw new BadRequestException(
            'Organizational with this name already exists',
          );
        }
      }

      if (data.projectId) {
        const project = await queryRunner.manager.findOne(Project, {
          where: { id: data.projectId },
        });

        if (!project) throw new NotFoundException('Project not found');

        if (data.projectId !== organizational.project.id) {
          organizational.project = project;
        }
      }

      await queryRunner.manager.save(organizational);
      await queryRunner.commitTransaction();

      return plainToClass(ReadOrganizationalDto, organizational);
    } catch (error) {
      console.log('🚀 ~ OrganizationalService ~ update ~ error:', error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string, user: User): Promise<{ message: string }> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const organizational = await this.organizationalRepository.findOne({
        where: { id },
        relations: ['project'],
      });

      if (!organizational)
        throw new NotFoundException('Organizational not found');

      await queryRunner.manager.remove(organizational);
      await queryRunner.commitTransaction();
      return { message: 'Organizational removed successfully' };
    } catch (error) {
      console.log('🚀 ~ OrganizationalService ~ remove ~ error:', error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async assignUser(
    id: string,
    data: AssignUserDto,
  ): Promise<{ message: string }> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { userId } = data;
      const organizational = await this.organizationalRepository.findOne({
        where: { id },
        relations: ['project', 'project.users', 'users'],
      });

      if (!organizational)
        throw new NotFoundException('Organizational not found');

      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
      });

      if (!user) throw new NotFoundException('User not found');

      if (!organizational.project.users.some((u) => u.id === user.id)) {
        throw new ForbiddenException(
          `You are not allowed to assign user to this organizational ${organizational.name} in project ${organizational.project.name}`,
        );
      }

      if (organizational.users.some((u) => u.id === userId)) {
        throw new BadRequestException(
          'User already assigned to this organizational',
        );
      }

      organizational.users.push(user);
      await queryRunner.manager.save(organizational);
      await queryRunner.commitTransaction();
      return { message: 'User assigned to organizational successfully' };
    } catch (error) {
      console.log('🚀 ~ OrganizationalService ~ assignUser ~ error:', error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async userHasAccess(
    userId: string,
    organizationalId: string,
  ): Promise<boolean> {
    const organizational = await this.organizationalRepository.findOne({
      where: { id: organizationalId },
      relations: ['users'],
    });

    return (
      !!organizational && organizational.users.some((u) => u.id === userId)
    );
  }
}
