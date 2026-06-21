import { Request } from 'express';
import { ConsentsService } from './consents.service';
export declare class ConsentsController {
    private consentsService;
    constructor(consentsService: ConsentsService);
    recordConsent(user: {
        id: string;
    }, policyType: string, req: Request): Promise<{
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
}
