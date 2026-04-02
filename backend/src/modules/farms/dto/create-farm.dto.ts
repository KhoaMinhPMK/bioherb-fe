import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsNumber } from 'class-validator';

export class CreateFarmDto {
  @ApiProperty()
  @IsInt()
  cooperativeId: number;

  @ApiProperty({ example: 'FARM001' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Nông trại Đà Lạt' })
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  managerUserId?: number;

  @ApiPropertyOptional({ default: 'hour' })
  @IsOptional()
  @IsString()
  timeMode?: string;

  @ApiPropertyOptional({ default: 8 })
  @IsOptional()
  @IsNumber()
  workdayHours?: number;
}
