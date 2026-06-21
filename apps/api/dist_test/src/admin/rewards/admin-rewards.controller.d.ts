import { AdminRewardsService } from './admin-rewards.service';
export declare class AdminRewardsController {
    private service;
    constructor(service: AdminRewardsService);
    findAll(page?: string, limit?: string): Promise<{
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
