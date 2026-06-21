import { AdminAuditLogsService } from './admin-audit-logs.service';
export declare class AdminAuditLogsController {
    private service;
    constructor(service: AdminAuditLogsService);
    findAll(page?: string, limit?: string): Promise<{
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
