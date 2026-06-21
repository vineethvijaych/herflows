import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminUsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: { select: { orders: true, subscriptions: true, rewardTransactions: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        preferences: true,
        _count: { select: { orders: true, subscriptions: true, rewardTransactions: true, reviews: true, supportTickets: true } },
        orders: { take: 5, orderBy: { placedAt: 'desc' } },
      },
    });
  }

  async update(id: string, data: { email?: string; phone?: string; status?: string }) {
    return this.prisma.user.update({ where: { id }, data: data as any });
  }
}
