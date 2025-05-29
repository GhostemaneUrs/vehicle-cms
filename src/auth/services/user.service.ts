import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
  Scope,
  Inject,
} from '@nestjs/common';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import {
  CreateUserDto,
  UpdateUserDto,
  ReadUserDto,
  AssignRoleDto,
} from '../dtos/user.dto';
import { plainToClass } from 'class-transformer';
import { TENANT_CONNECTION } from '../../database/common/database.tokens';
import { Role } from '../entities/roles.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  private readonly userRepository: Repository<User>;

  constructor(
    @Inject(TENANT_CONNECTION)
    private readonly dataSource: DataSource,
  ) {
    this.userRepository = this.dataSource.getRepository(User);
  }

  async create(dto: CreateUserDto): Promise<ReadUserDto> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const exists = await queryRunner.manager.findOne(User, {
        where: [{ username: dto.username }, { email: dto.email }],
      });

      if (exists) {
        throw new ConflictException('Username or email already taken');
      }

      const passwordHash = await bcrypt.hash(dto.password, 10);

      const user = queryRunner.manager.create(User, {
        username: dto.username,
        email: dto.email,
        passwordHash,
      });

      const saved = await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();

      const { username, email } = saved;
      return plainToClass(ReadUserDto, { username, email });
    } catch (error) {
      console.log('🚀 ~ UserService ~ create ~ error:', error);
      await queryRunner.rollbackTransaction();

      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<ReadUserDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (dto.password) {
        dto['passwordHash'] = await bcrypt.hash(dto.password, 10);
        delete dto.password;
      }

      Object.assign(user, dto);
      const saved = await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
      const { username, email } = saved;

      return plainToClass(ReadUserDto, { username, email });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async assignRole(userId: string, data: AssignRoleDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { roleId } = data;

      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        relations: ['roles'],
      });

      if (!user) throw new NotFoundException('User not found');

      const role = await queryRunner.manager.findOne(Role, {
        where: { id: roleId },
      });

      if (!role) throw new NotFoundException('Role not found');

      user.roles.push(role);
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username, isActive: true },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAll(): Promise<ReadUserDto[]> {
    const users = await this.userRepository.find({ where: { isActive: true } });
    return users.map((user) => plainToClass(ReadUserDto, user));
  }

  async findOne(id: string): Promise<ReadUserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (!user.isActive) throw new UnauthorizedException('User is not active');

    return plainToClass(ReadUserDto, user);
  }

  async findByIdToToken(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async remove(id: string): Promise<ReadUserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    user.isActive = false;
    await this.userRepository.save(user);

    return plainToClass(ReadUserDto, user);
  }

  async setCurrentRefreshToken(hash: string, userId: string) {
    await this.userRepository.update(userId, { refreshTokenHash: hash });
  }

  async removeRefreshToken(userId: string) {
    await this.userRepository.update(userId, { refreshTokenHash: null });
  }
}
