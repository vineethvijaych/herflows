import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: {
    category?: string;
    brand?: string;
    priceMin?: number;
    priceMax?: number;
    sustainability?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { status: 'active' };

    if (filters.category) where.categoryId = filters.category;
    if (filters.brand) where.brandId = filters.brand;
    if (filters.sustainability) {
      where.category = { sustainabilityTag: filters.sustainability };
    }
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters.priceMin || filters.priceMax) {
      where.variants = {
        some: {
          price: {
            ...(filters.priceMin ? { gte: filters.priceMin } : {}),
            ...(filters.priceMax ? { lte: filters.priceMax } : {}),
          },
        },
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          brand: true,
          category: true,
          variants: true,
          images: { orderBy: { sortOrder: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        variants: true,
        images: { orderBy: { sortOrder: 'asc' } },
        reviews: {
          where: { status: 'approved' },
          include: { user: { select: { id: true, email: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}
