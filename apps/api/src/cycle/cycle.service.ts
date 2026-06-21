import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CycleService {
  constructor(private prisma: PrismaService) {}

  async createEntry(userId: string, data: {
    date: string;
    flowLevel?: string;
    mood?: string;
    symptoms?: string[];
    notes?: string;
  }) {
    const entry = await this.prisma.cycleEntry.create({
      data: {
        userId,
        date: new Date(data.date),
        flowLevel: data.flowLevel,
        mood: data.mood,
        symptoms: data.symptoms || [],
        notes: data.notes,
      },
    });

    await this.recalculateEstimate(userId);

    return entry;
  }

  private async recalculateEstimate(userId: string) {
    const entries = await this.prisma.cycleEntry.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 6,
    });

    let estimatedStartDate: Date;
    if (entries.length >= 2) {
      const sorted = [...entries].sort((a: { date: Date }, b: { date: Date }) => a.date.getTime() - b.date.getTime());
      const avgCycle = (sorted[sorted.length - 1].date.getTime() - sorted[0].date.getTime()) / (sorted.length - 1);
      const avgCycleDays = Math.round(avgCycle / (1000 * 60 * 60 * 24));
      const lastDate = sorted[sorted.length - 1].date;
      estimatedStartDate = new Date(lastDate.getTime() + avgCycleDays * 24 * 60 * 60 * 1000);
    } else {
      estimatedStartDate = new Date();
      estimatedStartDate.setDate(estimatedStartDate.getDate() + 28);
    }

    const existing = await this.prisma.cycleEstimate.findFirst({
      where: { userId },
      orderBy: { generatedAt: 'desc' },
    });

    if (existing) {
      await this.prisma.cycleEstimate.delete({ where: { id: existing.id } });
    }

    await this.prisma.cycleEstimate.create({
      data: {
        userId,
        estimatedStartDate,
        disclaimerText: 'This estimate is not medical advice and may not be accurate.',
      },
    });
  }

  async getEstimate(userId: string) {
    const existing = await this.prisma.cycleEstimate.findFirst({
      where: { userId },
      orderBy: { generatedAt: 'desc' },
    });

    if (existing) {
      return existing;
    }

    const entries = await this.prisma.cycleEntry.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 6,
    });

    let estimatedStartDate: Date;
    if (entries.length >= 2) {
      const sorted = [...entries].sort((a: { date: Date }, b: { date: Date }) => a.date.getTime() - b.date.getTime());
      const avgCycle = (sorted[sorted.length - 1].date.getTime() - sorted[0].date.getTime()) / (sorted.length - 1);
      const avgCycleDays = Math.round(avgCycle / (1000 * 60 * 60 * 24));
      const lastDate = sorted[sorted.length - 1].date;
      estimatedStartDate = new Date(lastDate.getTime() + avgCycleDays * 24 * 60 * 60 * 1000);
    } else {
      estimatedStartDate = new Date();
      estimatedStartDate.setDate(estimatedStartDate.getDate() + 28);
    }

    return this.prisma.cycleEstimate.create({
      data: {
        userId,
        estimatedStartDate,
        disclaimerText: 'This estimate is not medical advice and may not be accurate. It is based solely on dates you have entered.',
      },
    });
  }

  async getEntries(userId: string) {
    return this.prisma.cycleEntry.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });
  }

  async deleteEntry(userId: string, entryId: string) {
    const entry = await this.prisma.cycleEntry.findFirst({
      where: { id: entryId, userId },
    });
    if (!entry) throw new Error('Entry not found');

    await this.prisma.cycleEntry.delete({ where: { id: entryId } });
    await this.recalculateEstimate(userId);

    return { deleted: true };
  }
}
