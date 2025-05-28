import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TENANT_CONNECTION } from '../../database/common/database.tokens';
import { Project } from '../entities/project.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import {
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

      const newProject = new Project();
      newProject.name = data.name;
      newProject.description = data.description;
      newProject.users = [user];

      await queryRunner.manager.save(newProject);

      await queryRunner.commitTransaction();
      return plainToClass(ReadProjectDto, newProject);
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

  async userHasAccess(userId: string, projectId: string): Promise<boolean> {
    const proj = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['users'],
    });

    return !!proj && proj.users.some((u) => u.id === userId);
  }
}
