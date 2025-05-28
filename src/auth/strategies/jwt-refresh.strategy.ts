import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(cfg: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.Refresh,
      ]),
      secretOrKey: cfg.get<string>('config.jwt.refreshSecret'),
      passReqToCallback: false,
    });
  }
  async validate(payload: any) {
    return { username: payload.username, sub: payload.sub };
  }
}
