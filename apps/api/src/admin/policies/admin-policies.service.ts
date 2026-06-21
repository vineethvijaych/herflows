import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminPoliciesService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.policyDocument.findMany({ skip, take: limit, orderBy: { publishedAt: 'desc' } }),
      this.prisma.policyDocument.count(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const doc = await this.prisma.policyDocument.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Policy not found');
    return doc;
  }

  async create(data: { type: string; version: number; content: string }) {
    return this.prisma.policyDocument.create({ data: { type: data.type as any, version: data.version, content: data.content } });
  }

  async update(id: string, data: { content?: string }) {
    return this.prisma.policyDocument.update({ where: { id }, data });
  }
}
