import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(cfg: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.Authentication,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: cfg.get<string>('config.jwtSecret'),
    });
  }

  async validate(payload: any) {
    return { username: payload.username };
  }
}
