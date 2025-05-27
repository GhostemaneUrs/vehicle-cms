import { PartialType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

import { IsNotEmpty } from 'class-validator';

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

export class UpdateUserDto extends PartialType(CreateUserDto) {}

@Exclude()
export class ReadUserDto {
  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  roles: string[];

  @Expose()
  permissions: string[];
}
