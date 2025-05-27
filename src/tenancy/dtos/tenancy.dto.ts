import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { IsString } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}

export class ReadTenantDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateTenantDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
