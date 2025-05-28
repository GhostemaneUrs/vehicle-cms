import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ReadProjectDto } from '../../projects/dto/project.dto';
import { ReadUserDto } from '../../auth/dtos/user.dto';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsUUID } from 'class-validator';

@Exclude()
export class ReadOrganizationalDto {
  @Expose()
  @ApiProperty({ description: 'Organizational ID' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Organizational name' })
  name: string;

  @Expose()
  @ApiProperty({ description: 'Organizational project' })
  @Type(() => ReadProjectDto)
  project: ReadProjectDto;

  @Expose()
  @ApiProperty({ description: 'Organizational users' })
  @Type(() => ReadUserDto)
  users: ReadUserDto[];
}

export class CreateOrganizationalDto {
  @ApiProperty({ description: 'Organizational name' })
  name: string;

  @ApiProperty({ description: 'Organizational project' })
  @IsUUID()
  projectId: string;
}

export class UpdateOrganizationalDto extends PartialType(
  CreateOrganizationalDto,
) {
  @ApiProperty({ description: 'Organizational id' })
  @IsUUID()
  id: string;
}
