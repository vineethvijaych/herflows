import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  async createTicket(userId: string, data: { subject: string; message: string }) {
    return this.prisma.supportTicket.create({
      data: {
        userId,
        subject: data.subject,
        messages: {
          create: {
            senderType: 'user',
            message: data.message,
          },
        },
      },
      include: { messages: true },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.supportTicket.findMany({
      where: { userId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
