import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class EquipmentService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto & { farmId?: number }) {
    const { page = 1, limit = 20, search, farmId } = query;
    const where: any = {};
    if (farmId) where.farmId = farmId;
    if (search) where.OR = [{ name: { contains: search } }, { code: { contains: search } }];

    const [data, total] = await Promise.all([
      this.prisma.equipment.findMany({ where, skip: (page - 1) * limit, take: limit, include: { farm: { select: { id: true, name: true } } } }),
      this.prisma.equipment.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const item = await this.prisma.equipment.findUnique({ where: { id }, include: { farm: true } });
    if (!item) throw new NotFoundException('Equipment not found');
    return item;
  }

  create(dto: CreateEquipmentDto) { return this.prisma.equipment.create({ data: dto }); }
  async update(id: number, dto: UpdateEquipmentDto) { await this.findOne(id); return this.prisma.equipment.update({ where: { id }, data: dto }); }
  async remove(id: number) { await this.findOne(id); return this.prisma.equipment.delete({ where: { id } }); }
}
