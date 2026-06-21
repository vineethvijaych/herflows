import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminSettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    return {
      siteName: 'HerFlows',
      supportEmail: 'support@herflows.com',
      supportPhone: '+1-800-HERFLOWS',
      rewardPointsPerOrder: 10,
      referralRewardPoints: 50,
      maxLoginAttempts: 5,
      maintenanceMode: false,
      currency: 'INR',
      timezone: 'Asia/Kolkata',
    };
  }

  async updateSettings(data: any) {
    return { ...(await this.getSettings()), ...data };
  }
}
