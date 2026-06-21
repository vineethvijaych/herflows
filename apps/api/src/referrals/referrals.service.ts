import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class ReferralsService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateCode(userId: string) {
    const existing = await this.prisma.referral.findFirst({
      where: { referrerUserId: userId },
    });

    if (existing) {
      return { code: existing.code };
    }

    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    return { code };
  }

  async getStatus(userId: string) {
    const referrals = await this.prisma.referral.findMany({
      where: { referrerUserId: userId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      total: referrals.length,
      rewarded: referrals.filter((r: any) => r.status === 'rewarded').length,
      pending: referrals.filter((r: any) => r.status !== 'rewarded').length,
      referrals,
    };
  }
}
