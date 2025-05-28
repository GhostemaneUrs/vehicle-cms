import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { UserService } from './user.service';
import { CreateUserDto } from '../dtos/user.dto';
import { ReadUserDto } from '../dtos/user.dto';
import { plainToClass } from 'class-transformer';
import { JwtPayload } from '../../@types/express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
    private readonly cfg: ConfigService,
  ) {}

  private getJwtPayload(user: ReadUserDto): Omit<JwtPayload, 'iat' | 'exp'> {
    return {
      sub: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles.map((role) => role.name),
      permissions: user.roles.flatMap((role) =>
        role.permissions.map((p) => p.name),
      ),
    };
  }

  async register(dto: CreateUserDto): Promise<ReadUserDto> {
    const user = await this.userService.create(dto);
    return plainToClass(ReadUserDto, user);
  }

  async login(
    user: ReadUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = this.getJwtPayload(user);

    const accessToken = this.jwt.sign(payload, {
      secret: this.cfg.get<string>('config.jwt.accessSecret'),
      expiresIn: this.cfg.get<string>('config.jwt.accessExpiresIn'),
    });

    const refreshToken = this.jwt.sign(payload, {
      secret: this.cfg.get<string>('config.jwt.refreshSecret'),
      expiresIn: this.cfg.get<string>('config.jwt.refreshExpiresIn'),
    });

    const hash = await bcrypt.hash(refreshToken, 10);

    await this.userService.setCurrentRefreshToken(hash, user.id);

    return { accessToken, refreshToken };
  }

  async validateUser(username: string, pass: string): Promise<ReadUserDto> {
    const user = await this.userService.findByUsername(username);

    const ok = await bcrypt.compare(pass, user.passwordHash);

    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return plainToClass(ReadUserDto, user);
  }

  async refreshTokens(userDto: JwtPayload, rt: string) {
    const user = await this.userService.findByUsername(userDto.username);

    if (!user.refreshTokenHash)
      throw new ForbiddenException('No refresh token stored');

    const matches = await bcrypt.compare(rt, user.refreshTokenHash);

    if (!matches) throw new ForbiddenException('Invalid refresh token');

    return this.login(plainToClass(ReadUserDto, user));
  }

  async logout(userId: string) {
    await this.userService.removeRefreshToken(userId);
  }
}
