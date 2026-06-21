import { SubscriptionsService } from './subscriptions.service';
export declare class SubscriptionsController {
    private subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    create(user: {
        id: string;
    }, data: {
        planType: string;
        kitTemplateId: string;
    }): Promise<{
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
    findAll(user: {
        id: string;
    }): Promise<({
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
    })[]>;
    pause(user: {
        id: string;
    }, id: string): Promise<{
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
    resume(user: {
        id: string;
    }, id: string): Promise<{
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
    skipNext(user: {
        id: string;
    }, id: string): Promise<{
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
    editUpcomingKit(user: {
        id: string;
    }, id: string, kitTemplateId: string): Promise<{
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
