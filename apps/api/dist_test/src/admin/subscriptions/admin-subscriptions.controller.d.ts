import { AdminSubscriptionsService } from './admin-subscriptions.service';
export declare class AdminSubscriptionsController {
    private service;
    constructor(service: AdminSubscriptionsService);
    findAll(page?: string, limit?: string, search?: string, status?: string): Promise<{
        data: ({
            user: {
                email: string;
                id: string;
            };
            events: {
                id: string;
                eventType: string;
                occurredAt: Date;
                actor: string;
                subscriptionId: string;
            }[];
        } & {
            id: string;
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            kitTemplateId: string;
            planType: import(".prisma/client").$Enums.PlanType;
            autoRenew: boolean;
            nextDispatchDate: Date;
            editLockDate: Date;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<{
        user: {
            email: string;
            phone: string;
            id: string;
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
        events: {
            id: string;
            eventType: string;
            occurredAt: Date;
            actor: string;
            subscriptionId: string;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        kitTemplateId: string;
        planType: import(".prisma/client").$Enums.PlanType;
        autoRenew: boolean;
        nextDispatchDate: Date;
        editLockDate: Date;
    }>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        kitTemplateId: string;
        planType: import(".prisma/client").$Enums.PlanType;
        autoRenew: boolean;
        nextDispatchDate: Date;
        editLockDate: Date;
    }>;
}
