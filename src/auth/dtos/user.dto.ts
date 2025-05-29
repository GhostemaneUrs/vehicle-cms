import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';

import { IsNotEmpty } from 'class-validator';
import { Role } from '../entities/roles.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  password: string;
}

@Exclude()
export class ReadUserDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  roles: Role[];
}

export class AuthResponseDto {
  @ApiProperty() accessToken: string;
  @ApiProperty() refreshToken: string;
}

export class AssignRoleDto {
  @ApiProperty({ description: 'Role id' })
  @IsUUID()
  roleId: string;
}
