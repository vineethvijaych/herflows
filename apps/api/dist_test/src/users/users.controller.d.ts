import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(user: {
        id: string;
    }): Promise<{
        email: string;
        phone: string;
        id: string;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
    }>;
    updateProfile(user: {
        id: string;
    }, data: {
        phone?: string;
    }): Promise<{
        email: string;
        phone: string;
        id: string;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
    }>;
}
