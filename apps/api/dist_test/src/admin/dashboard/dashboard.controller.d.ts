import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(): Promise<{
        activeUsers: number;
        activeOrders: number;
        activeSubscriptions: number;
        lowStockItems: number;
        totalRevenue: number;
    }>;
    getRevenue(): Promise<{
        month: string;
        revenue: number;
    }[]>;
    getRecentOrders(): Promise<({
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
