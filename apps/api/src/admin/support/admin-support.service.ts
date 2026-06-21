import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminSupportService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      this.prisma.supportTicket.findMany({
        where, skip, take: limit,
        include: { user: { select: { id: true, email: true } }, messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.supportTicket.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    return this.prisma.supportTicket.findUnique({
      where: { id },
      include: { user: { select: { id: true, email: true } }, messages: { orderBy: { createdAt: 'asc' } } },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.supportTicket.update({ where: { id }, data: { status: status as any } });
  }

  async reply(id: string, adminId: string, message: string) {
    return this.prisma.supportTicketMessage.create({
      data: { ticketId: id, senderType: 'admin', message },
    });
  }
}
