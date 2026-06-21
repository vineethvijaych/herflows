import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
        email: string;
        phone: string;
        id: string;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
    }>;
    update(id: string, data: {
        phone?: string;
    }): Promise<{
        email: string;
        phone: string;
        id: string;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
    }>;
}
