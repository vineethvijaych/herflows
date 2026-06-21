import { AdminRolesService } from './admin-roles.service';
export declare class AdminRolesController {
    private service;
    constructor(service: AdminRolesService);
    findAll(): Promise<({
        _count: {
            adminUsers: number;
        };
        permissions: {
            id: string;
            roleId: string;
            action: string;
            module: string;
        }[];
    } & {
        id: string;
        name: string;
    })[]>;
    findById(id: string): Promise<{
        permissions: {
            id: string;
            roleId: string;
            action: string;
            module: string;
        }[];
        adminUsers: {
            email: string;
            id: string;
            name: string;
        }[];
    } & {
        id: string;
        name: string;
    }>;
    create(data: {
        name: string;
    }): Promise<{
        id: string;
        name: string;
    }>;
    update(id: string, data: {
        name?: string;
    }): Promise<{
        id: string;
        name: string;
    }>;
    delete(id: string): Promise<{
        id: string;
        name: string;
    }>;
    setPermission(id: string, data: {
        module: string;
        action: string;
        grant: boolean;
    }): Promise<import(".prisma/client").Prisma.BatchPayload | {
        id: string;
        roleId: string;
        action: string;
        module: string;
    }>;
}
