import { PrismaService } from '../prisma/prisma.service';
export declare class SubscriptionsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, data: {
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
    findByUser(userId: string): Promise<({
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
    pause(userId: string, id: string): Promise<{
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
    resume(userId: string, id: string): Promise<{
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
    skipNext(userId: string, id: string): Promise<{
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
    editUpcomingKit(userId: string, id: string, kitTemplateId: string): Promise<{
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
    private getUserSubscription;
}
