import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class FarmsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto & { cooperativeId?: number }) {
    const { page = 1, limit = 20, search, cooperativeId } = query;
    const where: any = {};
    if (cooperativeId) where.cooperativeId = cooperativeId;
    if (search) where.OR = [{ name: { contains: search } }, { code: { contains: search } }];

    const [data, total] = await Promise.all([
      this.prisma.farm.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          cooperative: { select: { id: true, name: true, code: true } },
          _count: { select: { plots: true, workers: true } },
        },
      }),
      this.prisma.farm.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const item = await this.prisma.farm.findUnique({
      where: { id },
      include: {
        cooperative: true,
        plots: true,
        _count: { select: { workers: true, equipment: true } },
      },
    });
    if (!item) throw new NotFoundException('Farm not found');
    return item;
  }

  async create(dto: CreateFarmDto) {
    return this.prisma.farm.create({
      data: dto,
      include: { cooperative: { select: { id: true, name: true } } },
    });
  }

  async update(id: number, dto: UpdateFarmDto) {
    await this.findOne(id);
    return this.prisma.farm.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.farm.delete({ where: { id } });
  }
}
