import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminEducationService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.educationArticle.findMany({
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
      }),
      this.prisma.educationArticle.count(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const article = await this.prisma.educationArticle.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async create(data: { title: string; content: string; excerpt?: string; category?: string; imageUrl?: string }) {
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return this.prisma.educationArticle.create({
      data: {
        slug,
        title: data.title,
        excerpt: data.excerpt || data.content.substring(0, 100),
        content: data.content,
        category: data.category || 'general',
        imageUrl: data.imageUrl || null,
        publishedAt: new Date(),
      },
    });
  }

  async update(id: string, data: { title?: string; content?: string; excerpt?: string; category?: string; imageUrl?: string }) {
    const existing = await this.prisma.educationArticle.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Article not found');
    return this.prisma.educationArticle.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    const existing = await this.prisma.educationArticle.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Article not found');
    await this.prisma.educationArticle.delete({ where: { id } });
    return { success: true };
  }
}
