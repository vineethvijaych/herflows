import { RewardsService } from './rewards.service';
export declare class RewardsController {
    private rewardsService;
    constructor(rewardsService: RewardsService);
    getBalance(user: {
        id: string;
    }): Promise<{
        balance: number;
    }>;
    getLedger(user: {
        id: string;
    }, page?: string, limit?: string): Promise<{
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
