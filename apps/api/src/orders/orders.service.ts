import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: { subscriptionId?: string; items: { productVariantId: string; quantity: number }[] }) {
    const variants = await this.prisma.productVariant.findMany({
      where: { id: { in: data.items.map(i => i.productVariantId) } },
    });

    const variantMap = new Map(variants.map((v: any) => [v.id, v]));

    const orderItems = data.items.map(item => {
      const variant = variantMap.get(item.productVariantId);
      if (!variant) throw new NotFoundException(`Variant ${item.productVariantId} not found`);
      return {
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        unitPrice: Number(variant.price),
      };
    });

    const totalAmount = orderItems.reduce((sum: number, item: any) => sum + Number(item.unitPrice) * item.quantity, 0);

    return this.prisma.order.create({
      data: {
        userId,
        subscriptionId: data.subscriptionId,
        totalAmount,
        items: { create: orderItems },
        statusHistory: { create: { status: 'kit_confirmed' } },
      },
      include: {
        items: true,
        statusHistory: true,
        payment: true,
        shipment: true,
      },
    });
  }

  async findById(userId: string, id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: {
        items: { include: { variant: { include: { product: true } } } },
        statusHistory: { orderBy: { changedAt: 'desc' } },
        payment: true,
        shipment: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findAllByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
        statusHistory: { orderBy: { changedAt: 'desc' }, take: 1 },
        payment: true,
        shipment: true,
      },
      orderBy: { placedAt: 'desc' },
    });
  }

  async getTracking(userId: string, id: string) {
    const order = await this.findById(userId, id);
    return order.shipment || { message: 'No tracking information available yet' };
  }
}
