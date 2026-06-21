import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminCategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.category.findMany({ skip, take: limit, orderBy: { name: 'asc' } }),
      this.prisma.category.count(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const cat = await this.prisma.category.findUnique({ where: { id }, include: { parent: true, children: true } });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  async create(data: { name: string; parentId?: string; sustainabilityTag?: string }) {
    return this.prisma.category.create({ data: { name: data.name, parentId: data.parentId, sustainabilityTag: data.sustainabilityTag } });
  }

  async update(id: string, data: { name?: string; parentId?: string; sustainabilityTag?: string }) {
    return this.prisma.category.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}
