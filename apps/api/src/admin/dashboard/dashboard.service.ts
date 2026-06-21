import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [activeUsers, activeOrders, activeSubscriptions, lowStockItems, totalRevenue] = await Promise.all([
      this.prisma.user.count({ where: { status: 'active' } }),
      this.prisma.order.count({ where: { status: { notIn: ['cancelled', 'refunded', 'delivered'] } } }),
      this.prisma.subscription.count({ where: { status: 'active' } }),
      this.prisma.productVariant.count({ where: { stockQty: { lte: 10 } } }),
      this.prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: { notIn: ['cancelled', 'refunded'] } } }),
    ]);

    return {
      activeUsers,
      activeOrders,
      activeSubscriptions,
      lowStockItems,
      totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
    };
  }

  async getRevenueData() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const orders = await this.prisma.order.findMany({
      where: { placedAt: { gte: sixMonthsAgo }, status: { notIn: ['cancelled', 'refunded'] } },
      select: { placedAt: true, totalAmount: true },
      orderBy: { placedAt: 'asc' },
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueMap: Record<string, number> = {};

    for (const order of orders) {
      const key = monthNames[order.placedAt.getMonth()];
      revenueMap[key] = (revenueMap[key] || 0) + Number(order.totalAmount);
    }

    const months: { month: string; revenue: number }[] = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const key = monthNames[d.getMonth()];
      months.push({ month: key, revenue: revenueMap[key] || 0 });
    }

    return months;
  }

  async getRecentOrders(limit = 5) {
    return this.prisma.order.findMany({
      take: limit,
      orderBy: { placedAt: 'desc' },
      include: {
        user: { select: { id: true, email: true } },
        items: { take: 1 },
        payment: { select: { status: true } },
      },
    });
  }
}
