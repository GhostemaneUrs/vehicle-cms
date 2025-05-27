import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { LoginDto } from '../dtos/auth.dto';
import { ReadUserDto } from '../dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly userSvc: UserService,
    private readonly jwt: JwtService,
  ) {}

  async validateUser(dto: LoginDto): Promise<ReadUserDto> {
    const user = await this.userSvc.findByUsername(dto.username);
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return plainToClass(ReadUserDto, user);
  }

  async login(user: ReadUserDto) {
    const token = this.jwt.sign({ sub: user.username });

    return { token, user };
  }
}
