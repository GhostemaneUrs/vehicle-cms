import { IsString } from 'class-validator';

import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class TokenDto {
  accessToken: string;
}

export interface JwtPayload {
  sub: string;
  username: string;
  email: string;
  roles: string[];
}
