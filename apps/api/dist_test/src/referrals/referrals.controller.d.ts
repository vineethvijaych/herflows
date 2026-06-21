import { ReferralsService } from './referrals.service';
export declare class ReferralsController {
    private referralsService;
    constructor(referralsService: ReferralsService);
    getCode(user: {
        id: string;
    }): Promise<{
        code: string;
    }>;
    getStatus(user: {
        id: string;
    }): Promise<{
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
