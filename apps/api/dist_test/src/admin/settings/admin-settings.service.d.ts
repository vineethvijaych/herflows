import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminSettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSettings(): Promise<{
        siteName: string;
        supportEmail: string;
        supportPhone: string;
        rewardPointsPerOrder: number;
        referralRewardPoints: number;
        maxLoginAttempts: number;
        maintenanceMode: boolean;
        currency: string;
        timezone: string;
    }>;
    updateSettings(data: any): Promise<any>;
}
