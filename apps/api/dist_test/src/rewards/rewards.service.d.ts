import { PrismaService } from '../prisma/prisma.service';
export declare class RewardsService {
    private prisma;
    constructor(prisma: PrismaService);
    getBalance(userId: string): Promise<{
        balance: number;
    }>;
    getLedger(userId: string, page?: number, limit?: number): Promise<{
        data: {
            id: string;
            createdAt: Date;
            type: import(".prisma/client").$Enums.RewardTransactionType;
            userId: string;
            source: import(".prisma/client").$Enums.RewardSource;
            amount: number;
            balanceAfter: number;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
