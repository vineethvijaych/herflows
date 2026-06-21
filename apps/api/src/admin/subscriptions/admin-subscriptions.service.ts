import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminSubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, search?: string, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) {
      where.user = { email: { contains: search, mode: 'insensitive' } };
    }
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.subscription.findMany({
        where, skip, take: limit,
        include: { user: { select: { id: true, email: true } }, events: { orderBy: { occurredAt: 'desc' }, take: 1 } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.subscription.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    return this.prisma.subscription.findUnique({
      where: { id },
      include: { user: { select: { id: true, email: true, phone: true } }, events: { orderBy: { occurredAt: 'desc' } }, orders: { take: 5, orderBy: { placedAt: 'desc' } } },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.subscription.update({
      where: { id },
      data: { status: status as any, events: { create: { eventType: `admin_${status}`, actor: 'admin' } } },
    });
  }
}
