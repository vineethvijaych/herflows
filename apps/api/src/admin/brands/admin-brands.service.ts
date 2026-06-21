import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminBrandsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.brand.findMany({ skip, take: limit, orderBy: { name: 'asc' } }),
      this.prisma.brand.count(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const brand = await this.prisma.brand.findUnique({ where: { id }, include: { products: { take: 5 } } });
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  async create(data: { name: string; description?: string }) {
    return this.prisma.brand.create({ data: { name: data.name, description: data.description } });
  }

  async update(id: string, data: { name?: string; description?: string }) {
    return this.prisma.brand.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.brand.delete({ where: { id } });
  }
}
