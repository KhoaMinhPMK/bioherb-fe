import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsDateString } from 'class-validator';

export class CreateTaskPlanDto {
  @ApiProperty()
  @IsInt()
  cropCycleId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  plotId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  taskTypeId?: number;

  @ApiProperty()
  @IsDateString()
  planDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shift?: string;

  @ApiProperty({ example: 'Bón phân đợt 1' })
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  assigneeUserId?: number;

  @ApiPropertyOptional({ default: 'planned' })
  @IsOptional()
  @IsString()
  status?: string;
}
