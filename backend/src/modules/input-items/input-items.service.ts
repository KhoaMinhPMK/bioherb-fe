import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateInputItemDto } from './dto/create-input-item.dto';
import { UpdateInputItemDto } from './dto/update-input-item.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class InputItemsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto & { type?: string }) {
    const { page = 1, limit = 20, search, type } = query;
    const where: any = {};
    if (type) where.type = type;
    if (search) where.OR = [{ name: { contains: search } }, { code: { contains: search } }];

    const [data, total] = await Promise.all([
      this.prisma.inputItem.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { name: 'asc' } }),
      this.prisma.inputItem.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const item = await this.prisma.inputItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('InputItem not found');
    return item;
  }

  create(dto: CreateInputItemDto) { return this.prisma.inputItem.create({ data: dto }); }
  async update(id: number, dto: UpdateInputItemDto) { await this.findOne(id); return this.prisma.inputItem.update({ where: { id }, data: dto }); }
  async remove(id: number) { await this.findOne(id); return this.prisma.inputItem.delete({ where: { id } }); }
}
