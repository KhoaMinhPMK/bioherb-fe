import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString, IsOptional, IsInt, IsDateString,
  IsNumber, IsArray, ValidateNested,
} from 'class-validator';

export class TaskLogWorkerDto {
  @ApiProperty()
  @IsInt()
  workerId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  hoursUsed?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  workdayQty?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  unitCost?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  totalCost?: number;
}

export class TaskLogInputDto {
  @ApiProperty()
  @IsInt()
  inputItemId: number;

  @ApiProperty()
  @IsNumber()
  qty: number;

  @ApiProperty()
  @IsString()
  unit: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  unitCost?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  totalCost?: number;
}

export class TaskLogEquipmentDto {
  @ApiProperty()
  @IsInt()
  equipmentId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  hoursUsed?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  unitCost?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  totalCost?: number;
}

export class CreateTaskLogDto {
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
  taskPlanId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  taskTypeId?: number;

  @ApiProperty()
  @IsDateString()
  workDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shift?: string;

  @ApiProperty({ example: 'Bón phân NPK' })
  @IsString()
  taskName: string;

  @ApiPropertyOptional({ default: 'hour' })
  @IsOptional()
  @IsString()
  timeMode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  breakMinutes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  hourQty?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  workdayQty?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  weatherNote?: string;

  @ApiPropertyOptional({ default: 'draft' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty()
  @IsInt()
  createdBy: number;

  @ApiPropertyOptional({ type: [TaskLogWorkerDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskLogWorkerDto)
  workers?: TaskLogWorkerDto[];

  @ApiPropertyOptional({ type: [TaskLogInputDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskLogInputDto)
  inputs?: TaskLogInputDto[];

  @ApiPropertyOptional({ type: [TaskLogEquipmentDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskLogEquipmentDto)
  equipment?: TaskLogEquipmentDto[];
}
