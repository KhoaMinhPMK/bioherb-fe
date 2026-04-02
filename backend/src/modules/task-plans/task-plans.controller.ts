import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TaskPlansService } from './task-plans.service';
import { CreateTaskPlanDto } from './dto/create-task-plan.dto';
import { UpdateTaskPlanDto } from './dto/update-task-plan.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('task-plans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('task-plans')
export class TaskPlansController {
  constructor(private service: TaskPlansService) {}

  @Get()
  @ApiOperation({ summary: 'List task plans' })
  @ApiQuery({ name: 'cropCycleId', required: false, type: Number })
  findAll(@Query() query: PaginationDto, @Query('cropCycleId') cropCycleId?: number) {
    return this.service.findAll({ ...query, cropCycleId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task plan detail' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create task plan' })
  create(@Body() dto: CreateTaskPlanDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update task plan' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTaskPlanDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task plan' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
