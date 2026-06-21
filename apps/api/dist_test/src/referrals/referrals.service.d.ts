import { PrismaService } from '../prisma/prisma.service';
export declare class ReferralsService {
    private prisma;
    constructor(prisma: PrismaService);
    getOrCreateCode(userId: string): Promise<{
        code: string;
    }>;
    getStatus(userId: string): Promise<{
        total: number;
        rewarded: number;
        pending: number;
        referrals: {
            id: string;
            status: import(".prisma/client").$Enums.ReferralStatus;
            createdAt: Date;
            referrerUserId: string;
            refereeUserId: string;
            code: string;
            rewardedAt: Date | null;
        }[];
    }>;
}
