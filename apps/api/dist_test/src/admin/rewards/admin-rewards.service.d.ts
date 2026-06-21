import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminRewardsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number): Promise<{
        data: ({
            user: {
                email: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            type: import(".prisma/client").$Enums.RewardTransactionType;
            userId: string;
            source: import(".prisma/client").$Enums.RewardSource;
            amount: number;
            balanceAfter: number;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
