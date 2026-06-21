import { AdminConsentLogsService } from './admin-consent-logs.service';
export declare class AdminConsentLogsController {
    private service;
    constructor(service: AdminConsentLogsService);
    findAll(page?: string, limit?: string): Promise<{
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
