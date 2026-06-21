import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminInventoryService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, lowStock?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (lowStock === 'true') where.stockQty = { lte: 10 };

    const [data, total] = await Promise.all([
      this.prisma.productVariant.findMany({
        where, skip, take: limit,
        include: { product: { select: { id: true, name: true, brand: { select: { name: true } } } } },
        orderBy: { stockQty: 'asc' },
      }),
      this.prisma.productVariant.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async adjustStock(variantId: string, delta: number, reason: string, adminUserId: string) {
    const variant = await this.prisma.productVariant.update({
      where: { id: variantId },
      data: { stockQty: { increment: delta } },
    });

    await this.prisma.inventoryAdjustment.create({
      data: { productVariantId: variantId, delta, reason, adminUserId },
    });

    return variant;
  }
}
