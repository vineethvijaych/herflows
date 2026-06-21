import { PrismaService } from '../../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        activeUsers: number;
        activeOrders: number;
        activeSubscriptions: number;
        lowStockItems: number;
        totalRevenue: number;
    }>;
    getRevenueData(): Promise<{
        month: string;
        revenue: number;
    }[]>;
    getRecentOrders(limit?: number): Promise<({
        user: {
            email: string;
            id: string;
        };
        payment: {
            status: import(".prisma/client").$Enums.PaymentStatus;
        };
        items: {
            id: string;
            orderId: string;
            quantity: number;
            productVariantId: string;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        updatedAt: Date;
        userId: string;
        subscriptionId: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        placedAt: Date;
    })[]>;
}
