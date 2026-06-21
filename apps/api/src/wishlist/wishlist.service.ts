import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async add(userId: string, productVariantId: string) {
    const existing = await this.prisma.wishlistItem.findUnique({
      where: { userId_productVariantId: { userId, productVariantId } },
    });

    if (existing) {
      throw new ConflictException('Item already in wishlist');
    }

    return this.prisma.wishlistItem.create({
      data: { userId, productVariantId },
      include: { variant: { include: { product: true } } },
    });
  }

  async findAll(userId: string) {
    return this.prisma.wishlistItem.findMany({
      where: { userId },
      include: { variant: { include: { product: true } } },
      orderBy: { addedAt: 'desc' },
    });
  }

  async remove(userId: string, id: string) {
    const item = await this.prisma.wishlistItem.findFirst({
      where: { id, userId },
    });

    if (!item) throw new NotFoundException('Wishlist item not found');

    return this.prisma.wishlistItem.delete({ where: { id } });
  }
}
