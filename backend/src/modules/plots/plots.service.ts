import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreatePlotDto } from './dto/create-plot.dto';
import { UpdatePlotDto } from './dto/update-plot.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class PlotsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto & { farmId?: number }) {
    const { page = 1, limit = 20, search, farmId } = query;
    const where: any = {};
    if (farmId) where.farmId = farmId;
    if (search) where.OR = [{ name: { contains: search } }, { code: { contains: search } }];

    const [data, total] = await Promise.all([
      this.prisma.plot.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          farm: { select: { id: true, name: true, code: true } },
          _count: { select: { cropCycles: true } },
        },
      }),
      this.prisma.plot.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const item = await this.prisma.plot.findUnique({
      where: { id },
      include: {
        farm: true,
        cropCycles: { orderBy: { startDate: 'desc' }, take: 5 },
      },
    });
    if (!item) throw new NotFoundException('Plot not found');
    return item;
  }

  async create(dto: CreatePlotDto) {
    return this.prisma.plot.create({ data: dto });
  }

  async update(id: number, dto: UpdatePlotDto) {
    await this.findOne(id);
    return this.prisma.plot.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.plot.delete({ where: { id } });
  }
}
