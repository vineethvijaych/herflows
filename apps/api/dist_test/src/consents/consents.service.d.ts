import { PrismaService } from '../prisma/prisma.service';
export declare class ConsentsService {
    private prisma;
    constructor(prisma: PrismaService);
    recordConsent(userId: string, policyType: string, ipAddress: string, userAgent: string): Promise<{
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
    }>;
    getLatestPolicy(type: string): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.PolicyType;
        version: number;
        content: string;
        publishedAt: Date;
    }>;
    private parseBrowser;
}
