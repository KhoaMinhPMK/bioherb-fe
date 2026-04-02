import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class WorkersService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto & { farmId?: number }) {
    const { page = 1, limit = 20, search, farmId } = query;
    const where: any = {};
    if (farmId) where.farmId = farmId;
    if (search) where.OR = [{ name: { contains: search } }, { code: { contains: search } }];

    const [data, total] = await Promise.all([
      this.prisma.worker.findMany({
        where, skip: (page - 1) * limit, take: limit,
        include: { farm: { select: { id: true, name: true } } },
      }),
      this.prisma.worker.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const item = await this.prisma.worker.findUnique({ where: { id }, include: { farm: true } });
    if (!item) throw new NotFoundException('Worker not found');
    return item;
  }

  create(dto: CreateWorkerDto) { return this.prisma.worker.create({ data: dto }); }
  async update(id: number, dto: UpdateWorkerDto) { await this.findOne(id); return this.prisma.worker.update({ where: { id }, data: dto }); }
  async remove(id: number) { await this.findOne(id); return this.prisma.worker.delete({ where: { id } }); }
}
