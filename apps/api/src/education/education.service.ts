import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EducationService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.educationArticle.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        category: true,
        imageUrl: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const article = await this.prisma.educationArticle.findUnique({
      where: { slug },
    });
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }
}
