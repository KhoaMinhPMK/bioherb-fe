import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { InputItemsService } from './input-items.service';
import { CreateInputItemDto } from './dto/create-input-item.dto';
import { UpdateInputItemDto } from './dto/update-input-item.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('input-items')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('input-items')
export class InputItemsController {
  constructor(private service: InputItemsService) {}

  @Get() @ApiOperation({ summary: 'List input items' })
  @ApiQuery({ name: 'type', required: false, type: String })
  findAll(@Query() q: PaginationDto, @Query('type') type?: string) { return this.service.findAll({ ...q, type }); }

  @Get(':id') @ApiOperation({ summary: 'Get input item' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Post() @ApiOperation({ summary: 'Create input item' })
  create(@Body() dto: CreateInputItemDto) { return this.service.create(dto); }

  @Put(':id') @ApiOperation({ summary: 'Update input item' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateInputItemDto) { return this.service.update(id, dto); }

  @Delete(':id') @ApiOperation({ summary: 'Delete input item' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
