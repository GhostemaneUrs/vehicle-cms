import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../@types/express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(cfg: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.Authentication,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: cfg.get<string>('config.jwt.accessSecret'),
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
