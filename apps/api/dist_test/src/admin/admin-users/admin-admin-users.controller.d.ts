import { AdminAdminUsersService } from './admin-admin-users.service';
export declare class AdminAdminUsersController {
    private service;
    constructor(service: AdminAdminUsersService);
    findAll(): Promise<({
        role: {
            id: string;
            name: string;
        };
    } & {
        email: string;
        id: string;
        passwordHash: string;
        createdAt: Date;
        name: string;
        roleId: string;
    })[]>;
    findById(id: string): Promise<{
        role: {
            permissions: {
                id: string;
                roleId: string;
                action: string;
                module: string;
            }[];
        } & {
            id: string;
            name: string;
        };
    } & {
        email: string;
        id: string;
        passwordHash: string;
        createdAt: Date;
        name: string;
        roleId: string;
    }>;
    create(data: {
        name: string;
        email: string;
        password: string;
        roleId: string;
    }): Promise<{
        role: {
            id: string;
            name: string;
        };
    } & {
        email: string;
        id: string;
        passwordHash: string;
        createdAt: Date;
        name: string;
        roleId: string;
    }>;
    update(id: string, data: any): Promise<{
        role: {
            id: string;
            name: string;
        };
    } & {
        email: string;
        id: string;
        passwordHash: string;
        createdAt: Date;
        name: string;
        roleId: string;
    }>;
    delete(id: string): Promise<{
        email: string;
        id: string;
        passwordHash: string;
        createdAt: Date;
        name: string;
        roleId: string;
    }>;
}
