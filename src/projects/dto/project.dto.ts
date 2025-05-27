import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ReadUserDto } from '../../auth/dtos/user.dto';
import { ReadTransferDto } from '../../transfers/dto/transfer.dto';
import { ReadOrganizationalDto } from '../../organizational/dto/organizational.dto';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Project name' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Project description' })
  description: string;

  @IsUUID()
  @ApiProperty({ description: 'User ID', format: 'uuid' })
  userId: string;

  @IsUUID()
  @ApiProperty({ description: 'Organizational ID', format: 'uuid' })
  organizationalId: string;
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsUUID()
  @ApiProperty({ description: 'Project ID', format: 'uuid' })
  id: string;
}

export class ReadProjectDto {
  @ApiProperty({ description: 'Project ID', format: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Project name' })
  name: string;

  @ApiProperty({ description: 'Project description' })
  description: string;

  @ApiProperty({ description: 'Project created at' })
  createdAt: Date;

  @ApiProperty({ description: 'Project organizational' })
  @Type(() => ReadOrganizationalDto)
  organizational: ReadOrganizationalDto;

  @ApiProperty({ description: 'Project users' })
  @Type(() => ReadUserDto)
  users: ReadUserDto[];

  @ApiProperty({ description: 'Project transfers' })
  @Type(() => ReadTransferDto)
  transfers: ReadTransferDto[];
}
