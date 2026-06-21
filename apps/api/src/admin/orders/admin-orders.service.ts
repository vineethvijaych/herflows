import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminOrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, search?: string, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, email: true } },
          items: true,
          payment: { select: { status: true } },
          shipment: true,
          statusHistory: { orderBy: { changedAt: 'desc' }, take: 1 },
        },
        orderBy: { placedAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, phone: true } },
        items: { include: { variant: { include: { product: true } } } },
        payment: true,
        shipment: true,
        statusHistory: { orderBy: { changedAt: 'desc' } },
      },
    });
  }

  async updateStatus(id: string, status: string, note?: string) {
    return this.prisma.order.update({
      where: { id },
      data: {
        status: status as any,
        statusHistory: { create: { status: status as any, note } },
      },
    });
  }
}
