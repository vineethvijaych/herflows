import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminConsentLogsService {
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
            userId: string;
            policyType: import(".prisma/client").$Enums.PolicyType;
            policyVersion: number;
            contentHash: string;
            ipAddress: string;
            userAgent: string;
            browser: string;
            country: string;
            language: string;
            acceptedAt: Date;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
