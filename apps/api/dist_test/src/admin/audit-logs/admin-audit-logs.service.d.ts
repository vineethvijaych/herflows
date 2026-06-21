import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminAuditLogsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number): Promise<{
        data: ({
            adminUser: {
                email: string;
                id: string;
                name: string;
            };
        } & {
            id: string;
            at: Date;
            adminUserId: string;
            action: string;
            entity: string;
            entityId: string;
            before: import("@prisma/client/runtime/library").JsonValue | null;
            after: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
