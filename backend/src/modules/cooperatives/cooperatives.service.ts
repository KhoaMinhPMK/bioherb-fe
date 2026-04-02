import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateCooperativeDto } from './dto/create-cooperative.dto';
import { UpdateCooperativeDto } from './dto/update-cooperative.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class CooperativesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 20, search } = query;
    const where = search
      ? { OR: [{ name: { contains: search } }, { code: { contains: search } }] }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.cooperative.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { farms: true, users: true } } },
      }),
      this.prisma.cooperative.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const item = await this.prisma.cooperative.findUnique({
      where: { id },
      include: { farms: true, _count: { select: { users: true } } },
    });
    if (!item) throw new NotFoundException('Cooperative not found');
    return item;
  }

  async create(dto: CreateCooperativeDto) {
    return this.prisma.cooperative.create({ data: dto });
  }

  async update(id: number, dto: UpdateCooperativeDto) {
    await this.findOne(id);
    return this.prisma.cooperative.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.cooperative.delete({ where: { id } });
  }
}
