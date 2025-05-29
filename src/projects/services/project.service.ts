import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TENANT_CONNECTION } from '../../database/common/database.tokens';
import { Project } from '../entities/project.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import {
  AssignUserDto,
  CreateProjectDto,
  ReadProjectDto,
  UpdateProjectDto,
} from '../dto/project.dto';
import { User } from '../../auth/entities/user.entity';

@Injectable()
export class ProjectService {
  private readonly projectRepository: Repository<Project>;

  constructor(
    @Inject(TENANT_CONNECTION)
    private readonly dataSource: DataSource,
  ) {
    this.projectRepository = this.dataSource.getRepository(Project);
  }

  async findAll(user: User): Promise<ReadProjectDto[]> {
    const projects = await this.projectRepository.find({
      relations: ['users'],
      where: {
        users: { id: user.id },
      },
    });

    return projects.map((project) => plainToClass(ReadProjectDto, project));
  }

  async findOne(id: string): Promise<ReadProjectDto> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!project) throw new NotFoundException('Project not found');

    return plainToClass(ReadProjectDto, project);
  }

  async create(data: CreateProjectDto, user: User): Promise<ReadProjectDto> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const project = await queryRunner.manager.findOne(Project, {
        where: {
          name: data.name,
        },
      });

      if (project) throw new BadRequestException('Project already exists');

      let projectUser = user;

      if (data.userId) {
        const foundUser = await queryRunner.manager.findOne(User, {
          where: { id: data.userId },
          relations: ['roles', 'roles.permissions'],
        });

        if (!foundUser) {
          throw new BadRequestException('User not found');
        }

        projectUser = foundUser;
      }

      const newProject = new Project();
      newProject.name = data.name;
      newProject.description = data.description;

      const saved = await queryRunner.manager.save(newProject);

      saved.users = [projectUser];
      await queryRunner.manager.save(saved);

      await queryRunner.commitTransaction();
      return plainToClass(ReadProjectDto, saved);
    } catch (error) {
      console.log('🚀 ~ ProjectService ~ create ~ error:', error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, data: UpdateProjectDto): Promise<ReadProjectDto> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const project = await this.projectRepository.findOne({
        where: { id },
        relations: ['users'],
      });

      if (!project) throw new NotFoundException('Project not found');

      if (data.name !== project.name) {
        const projectWithSameName = await queryRunner.manager.findOne(Project, {
          where: { name: data.name },
        });

        if (projectWithSameName)
          throw new BadRequestException(
            'Project with this name already exists',
          );

        project.name = data.name;
      }

      if (data.description !== project.description) {
        project.description = data.description;
      }

      await queryRunner.manager.save(project);
      await queryRunner.commitTransaction();
      return plainToClass(ReadProjectDto, project);
    } catch (error) {
      console.log('🚀 ~ ProjectService ~ error:', error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const project = await this.projectRepository.findOne({
        where: { id },
        relations: ['users'],
      });

      if (!project) throw new NotFoundException('Project not found');

      await queryRunner.manager.remove(project);
      await queryRunner.commitTransaction();
      return { message: 'Project deleted successfully' };
    } catch (error) {
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

      const project = await this.projectRepository.findOne({
        where: { id },
        relations: ['users'],
      });

      if (!project) throw new NotFoundException('Project not found');

      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
      });

      if (!user) throw new NotFoundException('User not found');

      project.users.push(user);
      await queryRunner.manager.save(project);
      await queryRunner.commitTransaction();
      return { message: 'User assigned to project successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async userHasAccess(userId: string, projectId: string): Promise<boolean> {
    const proj = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['users'],
    });

    return !!proj && proj.users.some((u) => u.id === userId);
  }
}
