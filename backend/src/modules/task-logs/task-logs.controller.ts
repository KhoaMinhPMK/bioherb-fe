import {
  Controller, Get, Post, Put, Delete, Patch,
  Param, Body, Query, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TaskLogsService } from './task-logs.service';
import { CreateTaskLogDto } from './dto/create-task-log.dto';
import { UpdateTaskLogDto } from './dto/update-task-log.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('task-logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('task-logs')
export class TaskLogsController {
  constructor(private service: TaskLogsService) {}

  @Get()
  @ApiOperation({ summary: 'List task logs' })
  @ApiQuery({ name: 'cropCycleId', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  findAll(
    @Query() query: PaginationDto,
    @Query('cropCycleId') cropCycleId?: number,
    @Query('status') status?: string,
  ) {
    return this.service.findAll({ ...query, cropCycleId, status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task log detail' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create task log with workers, inputs, equipment' })
  create(@Body() dto: CreateTaskLogDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update task log' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTaskLogDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/submit')
  @ApiOperation({ summary: 'Submit task log for approval' })
  submit(@Param('id', ParseIntPipe) id: number) {
    return this.service.submit(id);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve task log' })
  approve(@Param('id', ParseIntPipe) id: number, @CurrentUser('id') userId: number) {
    return this.service.approve(id, userId);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject task log' })
  reject(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @Body('reason') reason: string,
  ) {
    return this.service.reject(id, userId, reason);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task log' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
