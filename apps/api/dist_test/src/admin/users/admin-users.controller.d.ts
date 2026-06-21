import { AdminUsersService } from './admin-users.service';
export declare class AdminUsersController {
    private adminUsersService;
    constructor(adminUsersService: AdminUsersService);
    findAll(page?: string, limit?: string, search?: string): Promise<{
        data: ({
            _count: {
                subscriptions: number;
                orders: number;
                rewardTransactions: number;
            };
        } & {
            email: string;
            phone: string | null;
            id: string;
            passwordHash: string;
            refreshTokenHash: string | null;
            status: import(".prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<{
        preferences: {
            id: string;
            createdAt: Date;
            version: number;
            userId: string;
            ageRange: string | null;
            cycleLength: string | null;
            flowIntensity: string | null;
            skinSensitivity: string | null;
            preferredMaterials: string[];
            sustainabilityPref: string | null;
            travelFrequency: string | null;
            budget: string | null;
            subscriptionPref: string | null;
        };
        orders: {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            updatedAt: Date;
            userId: string;
            subscriptionId: string | null;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            placedAt: Date;
        }[];
        _count: {
            subscriptions: number;
            orders: number;
            rewardTransactions: number;
            reviews: number;
            supportTickets: number;
        };
    } & {
        email: string;
        phone: string | null;
        id: string;
        passwordHash: string;
        refreshTokenHash: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: {
        email?: string;
        phone?: string;
        status?: string;
    }): Promise<{
        email: string;
        phone: string | null;
        id: string;
        passwordHash: string;
        refreshTokenHash: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
