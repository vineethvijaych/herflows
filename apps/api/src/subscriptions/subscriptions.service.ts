import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: { planType: string; kitTemplateId: string }) {
    const now = new Date();
    const nextDispatch = new Date(now);
    nextDispatch.setDate(nextDispatch.getDate() + 30);

    const editLock = new Date(nextDispatch);
    editLock.setDate(editLock.getDate() - 10);

    return this.prisma.subscription.create({
      data: {
        userId,
        planType: data.planType as any,
        kitTemplateId: data.kitTemplateId,
        nextDispatchDate: nextDispatch,
        editLockDate: editLock,
        events: {
          create: {
            eventType: 'created',
            actor: 'user',
          },
        },
      },
      include: { events: true },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.subscription.findMany({
      where: { userId },
      include: { events: { orderBy: { occurredAt: 'desc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async pause(userId: string, id: string) {
    const sub = await this.getUserSubscription(id, userId);
    if (sub.status !== 'active') throw new BadRequestException('Subscription is not active');

    return this.prisma.subscription.update({
      where: { id },
      data: {
        status: 'paused',
        events: { create: { eventType: 'paused', actor: 'user' } },
      },
    });
  }

  async resume(userId: string, id: string) {
    const sub = await this.getUserSubscription(id, userId);
    if (sub.status !== 'paused') throw new BadRequestException('Subscription is not paused');

    return this.prisma.subscription.update({
      where: { id },
      data: {
        status: 'active',
        events: { create: { eventType: 'resumed', actor: 'user' } },
      },
    });
  }

  async skipNext(userId: string, id: string) {
    const sub = await this.getUserSubscription(id, userId);
    if (sub.status !== 'active') throw new BadRequestException('Subscription is not active');

    return this.prisma.subscription.update({
      where: { id },
      data: {
        status: 'skipped_this_cycle',
        events: { create: { eventType: 'skipped_next', actor: 'user' } },
      },
    });
  }

  async editUpcomingKit(userId: string, id: string, kitTemplateId: string) {
    const sub = await this.getUserSubscription(id, userId);

    const now = new Date();
    if (now >= sub.editLockDate) {
      throw new ForbiddenException(
        'Cannot edit kit within 10 days of dispatch. Edit lock date has passed.',
      );
    }

    return this.prisma.subscription.update({
      where: { id },
      data: {
        kitTemplateId,
        events: { create: { eventType: 'kit_updated', actor: 'user' } },
      },
    });
  }

  private async getUserSubscription(id: string, userId: string) {
    const sub = await this.prisma.subscription.findFirst({
      where: { id, userId },
    });

    if (!sub) throw new NotFoundException('Subscription not found');
    return sub;
  }
}
