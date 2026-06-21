import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KitTemplatesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: { name: string; items: { productVariantId: string; quantity: number }[] }) {
    if (data.items.length === 0) {
      data.items = [];
    }

    return this.prisma.kitTemplate.create({
      data: {
        userId,
        name: data.name,
        items: {
          create: data.items.map(item => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });
  }

  async update(id: string, userId: string, data: { name?: string; items?: { productVariantId: string; quantity: number }[] }) {
    const template = await this.prisma.kitTemplate.findFirst({
      where: { id, userId },
    });

    if (!template) throw new NotFoundException('Kit template not found');

    if (data.items) {
      await this.prisma.kitTemplateItem.deleteMany({ where: { kitTemplateId: id } });
      await this.prisma.kitTemplateItem.createMany({
        data: data.items.map(item => ({
          kitTemplateId: id,
          productVariantId: item.productVariantId,
          quantity: item.quantity,
        })),
      });
    }

    return this.prisma.kitTemplate.update({
      where: { id },
      data: { name: data.name },
      include: { items: true },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.kitTemplate.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async setActive(userId: string, id: string) {
    await this.prisma.kitTemplate.updateMany({
      where: { userId, isActiveSource: true },
      data: { isActiveSource: false },
    });

    return this.prisma.kitTemplate.update({
      where: { id },
      data: { isActiveSource: true },
    });
  }
}
