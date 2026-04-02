import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { WorkersService } from './workers.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('workers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workers')
export class WorkersController {
  constructor(private service: WorkersService) {}

  @Get() @ApiOperation({ summary: 'List workers' })
  @ApiQuery({ name: 'farmId', required: false, type: Number })
  findAll(@Query() q: PaginationDto, @Query('farmId') farmId?: number) { return this.service.findAll({ ...q, farmId }); }

  @Get(':id') @ApiOperation({ summary: 'Get worker' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Post() @ApiOperation({ summary: 'Create worker' })
  create(@Body() dto: CreateWorkerDto) { return this.service.create(dto); }

  @Put(':id') @ApiOperation({ summary: 'Update worker' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateWorkerDto) { return this.service.update(id, dto); }

  @Delete(':id') @ApiOperation({ summary: 'Delete worker' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
