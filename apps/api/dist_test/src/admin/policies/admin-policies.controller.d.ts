import { AdminPoliciesService } from './admin-policies.service';
export declare class AdminPoliciesController {
    private service;
    constructor(service: AdminPoliciesService);
    findAll(page?: string, limit?: string): Promise<{
        data: {
            id: string;
            type: import(".prisma/client").$Enums.PolicyType;
            version: number;
            content: string;
            publishedAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.PolicyType;
        version: number;
        content: string;
        publishedAt: Date;
    }>;
    create(data: {
        type: string;
        version: number;
        content: string;
    }): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.PolicyType;
        version: number;
        content: string;
        publishedAt: Date;
    }>;
    update(id: string, data: {
        content?: string;
    }): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.PolicyType;
        version: number;
        content: string;
        publishedAt: Date;
    }>;
}
