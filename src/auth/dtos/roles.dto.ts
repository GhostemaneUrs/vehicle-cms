import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ArrayUnique,
} from 'class-validator';
import { ApiPropertyOptional, ApiProperty, PartialType } from '@nestjs/swagger';
import { Permission } from '../entities/permissions.entity';

export class CreateRoleDto {
  @ApiProperty({ description: 'Unique name for the role', example: 'admin' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the role',
    example: 'Administrator with full access',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'List of permission IDs to attach to this role',
    example: ['uuid-perm-1', 'uuid-perm-2'],
    type: [String],
  })
  @IsUUID('4', { each: true })
  @ArrayUnique()
  @IsOptional()
  permissionIds?: string[];
}

export class ReadRoleDto {
  @ApiProperty({ description: 'Role UUID', example: 'uuid-role-1' })
  id: string;

  @ApiProperty({ description: 'Role name', example: 'admin' })
  name: string;

  @ApiProperty({
    description: 'Role description',
    example: 'Administrator with full access',
  })
  description?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-05-26T12:34:56.789Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Permissions assigned to this role',
    type: [Permission],
  })
  permissions: Permission[];
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @ApiProperty({
    description: 'UUID of the role to update',
    example: 'uuid-role-1',
  })
  @IsUUID()
  id: string;
}
