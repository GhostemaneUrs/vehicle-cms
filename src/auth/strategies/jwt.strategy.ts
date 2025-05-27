import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../services/user.service';
import { ReadUserDto } from '../dtos/user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(cfg: ConfigService, private readonly userSvc: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: cfg.get<string>('config.jwtSecret'),
    });
  }

  async validate(payload: { username: string }) {
    const user = await this.userSvc.findByUsername(payload.username);
    if (!user) {
      throw new UnauthorizedException();
    }

    const userWithPermissions: ReadUserDto = {
      ...user,
      roles: user.roles.map((r) => r.name),
      permissions: user.roles.flatMap((r) => r.permissions).map((p) => p.name),
    };

    return userWithPermissions;
  }
}
