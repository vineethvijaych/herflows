import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { name: { contains: search, mode: 'insensitive' } } },
      ];
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
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { brand: true, category: true, variants: true, images: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(data: { name: string; description?: string; brandId: string; categoryId: string; materials?: string[]; status?: string }) {
    return this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description || '',
        brandId: data.brandId,
        categoryId: data.categoryId,
        materials: data.materials || [],
        status: (data.status as any) || 'active',
      },
      include: { brand: true, category: true, variants: true, images: true },
    });
  }

  async update(id: string, data: { name?: string; description?: string; brandId?: string; categoryId?: string; materials?: string[]; status?: string }) {
    const updateData: any = { ...data };
    if (data.brandId) {
      updateData.brand = { connect: { id: data.brandId } };
      delete updateData.brandId;
    }
    if (data.categoryId) {
      updateData.category = { connect: { id: data.categoryId } };
      delete updateData.categoryId;
    }
    return this.prisma.product.update({
      where: { id },
      data: updateData,
      include: { brand: true, category: true, variants: true, images: true },
    });
  }

  async delete(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }

  async createVariant(productId: string, data: { sku: string; attributes: any; price: number; stockQty?: number }) {
    try {
      return await this.prisma.productVariant.create({
        data: { productId, sku: data.sku, attributes: data.attributes, price: data.price, stockQty: data.stockQty || 0 },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException(`A variant with SKU "${data.sku}" already exists`);
      }
      throw err;
    }
  }

  async updateVariant(id: string, data: { sku?: string; attributes?: any; price?: number; stockQty?: number }) {
    try {
      return await this.prisma.productVariant.update({ where: { id }, data });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException(`A variant with SKU "${data.sku}" already exists`);
      }
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException('Variant not found');
      }
      throw err;
    }
  }

  async deleteVariant(id: string) {
    return this.prisma.productVariant.delete({ where: { id } });
  }

  async addImage(productId: string, url: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
    const maxSort = await this.prisma.productImage.aggregate({
      where: { productId },
      _max: { sortOrder: true },
    });
    const sortOrder = (maxSort._max.sortOrder ?? -1) + 1;
    return this.prisma.productImage.create({
      data: { productId, url, sortOrder },
    });
  }

  async removeImage(imageId: string) {
    const image = await this.prisma.productImage.findUnique({ where: { id: imageId } });
    if (!image) throw new NotFoundException('Image not found');
    return this.prisma.productImage.delete({ where: { id: imageId } });
  }
}
