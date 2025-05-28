import { ReadUserDto } from '../../auth/dtos/user.dto';

export interface JwtPayload {
  sub: string;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
      cookies: Record<string, string>;
    }
  }
}
