import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class ConsentsService {
  constructor(private prisma: PrismaService) {}

  async recordConsent(
    userId: string,
    policyType: string,
    ipAddress: string,
    userAgent: string,
  ) {
    const policy = await this.prisma.policyDocument.findFirst({
      where: { type: policyType as any },
      orderBy: { version: 'desc' },
    });

    if (!policy) {
      throw new NotFoundException(`No published policy found for type: ${policyType}`);
    }

    const existing = await this.prisma.consentLog.findFirst({
      where: { userId, policyType: policyType as any, policyVersion: policy.version },
    });

    if (existing) {
      throw new ConflictException('Consent already recorded for this policy version');
    }

    const contentHash = crypto.createHash('sha256').update(policy.content).digest('hex');
    const browser = this.parseBrowser(userAgent);

    return this.prisma.consentLog.create({
      data: {
        userId,
        policyType: policyType as any,
        policyVersion: policy.version,
        contentHash,
        ipAddress,
        userAgent,
        browser,
        country: '',
        language: '',
      },
    });
  }

  async getLatestPolicy(type: string) {
    const policy = await this.prisma.policyDocument.findFirst({
      where: { type: type as any },
      orderBy: { version: 'desc' },
    });

    if (!policy) {
      throw new NotFoundException(`No policy found for type: ${type}`);
    }

    return policy;
  }

  private parseBrowser(ua: string): string {
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  }
}
