import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: { productId: string; orderId: string; rating: number; text: string; photos?: string[] }) {
    const order = await this.prisma.order.findFirst({
      where: { id: data.orderId, userId, status: 'delivered' },
    });

    if (!order) {
      throw new ForbiddenException('Only verified buyers with delivered orders can leave reviews');
    }

    const existing = await this.prisma.review.findUnique({
      where: { userId_orderId_productId: { userId, orderId: data.orderId, productId: data.productId } },
    });

    if (existing) {
      throw new ForbiddenException('You have already reviewed this product for this order');
    }

    const review = await this.prisma.review.create({
      data: {
        userId,
        productId: data.productId,
        orderId: data.orderId,
        rating: data.rating,
        text: data.text,
        photos: data.photos || [],
      },
    });

    await this.updateProductRating(data.productId);
    return review;
  }

  async findByProduct(productId: string) {
    return this.prisma.review.findMany({
      where: { productId, status: 'approved' },
      include: { user: { select: { id: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async updateProductRating(productId: string) {
    const result = await this.prisma.review.aggregate({
      where: { productId, status: 'approved' },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        averageRating: result._avg.rating || 0,
        reviewCount: result._count.rating,
      },
    });
  }
}
