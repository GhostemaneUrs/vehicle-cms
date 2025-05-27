import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional, ApiProperty, PartialType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'Unique permission name',
    example: 'view_transfers',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Permission description',
    example: 'Can view transfer records',
  })
  @IsString()
  @IsOptional()
  description: string;
}

@Exclude()
export class ReadPermissionDto {
  @Expose()
  @ApiProperty({ description: 'Permission UUID', example: 'uuid-perm-1' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Permission name', example: 'view_transfers' })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'Permission description',
    example: 'Can view transfer records',
  })
  description: string;
}

@Exclude()
export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @ApiProperty({
    description: 'UUID of the permission to update',
    example: 'uuid-perm-1',
  })
  @IsUUID()
  id: string;
}
