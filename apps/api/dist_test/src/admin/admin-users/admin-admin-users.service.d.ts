import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminAdminUsersService {
    private prisma;
    constructor(prisma: PrismaService);
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
    update(id: string, data: {
        name?: string;
        email?: string;
        roleId?: string;
        password?: string;
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
    delete(id: string): Promise<{
        email: string;
        id: string;
        passwordHash: string;
        createdAt: Date;
        name: string;
        roleId: string;
    }>;
}
