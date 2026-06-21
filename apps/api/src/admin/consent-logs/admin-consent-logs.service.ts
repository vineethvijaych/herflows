import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminConsentLogsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.consentLog.findMany({
        skip, take: limit,
        include: { user: { select: { id: true, email: true } } },
        orderBy: { acceptedAt: 'desc' },
      }),
      this.prisma.consentLog.count(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
