import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminPoliciesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number): Promise<{
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
