import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsNumber } from 'class-validator';

export class CreateWorkerDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  userId?: number;

  @ApiProperty()
  @IsInt()
  farmId: number;

  @ApiProperty({ example: 'NV001' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Trần Văn B' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ default: 'Nhân viên' })
  @IsOptional()
  @IsString()
  roleTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ default: 250000 })
  @IsOptional()
  @IsNumber()
  dailyRate?: number;
}
