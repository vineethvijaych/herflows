import { PrismaService } from '../prisma/prisma.service';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, data: {
        subscriptionId?: string;
        items: {
            productVariantId: string;
            quantity: number;
        }[];
    }): Promise<{
        shipment: {
            id: string;
            status: string;
            orderId: string;
            carrier: string;
            trackingId: string;
            lastSyncedAt: Date | null;
        };
        payment: {
            id: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            orderId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            provider: string;
            providerRef: string;
        };
        items: {
            id: string;
            orderId: string;
            quantity: number;
            productVariantId: string;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
        }[];
        statusHistory: {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            orderId: string;
            changedAt: Date;
            note: string | null;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        updatedAt: Date;
        userId: string;
        subscriptionId: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        placedAt: Date;
    }>;
    findById(userId: string, id: string): Promise<{
        shipment: {
            id: string;
            status: string;
            orderId: string;
            carrier: string;
            trackingId: string;
            lastSyncedAt: Date | null;
        };
        payment: {
            id: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            orderId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            provider: string;
            providerRef: string;
        };
        items: ({
            variant: {
                product: {
                    id: string;
                    status: import(".prisma/client").$Enums.ProductStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    description: string;
                    brandId: string;
                    categoryId: string;
                    materials: string[];
                    averageRating: number;
                    reviewCount: number;
                };
            } & {
                id: string;
                createdAt: Date;
                productId: string;
                sku: string;
                attributes: import("@prisma/client/runtime/library").JsonValue;
                price: import("@prisma/client/runtime/library").Decimal;
                stockQty: number;
            };
        } & {
            id: string;
            orderId: string;
            quantity: number;
            productVariantId: string;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
        })[];
        statusHistory: {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            orderId: string;
            changedAt: Date;
            note: string | null;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        updatedAt: Date;
        userId: string;
        subscriptionId: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        placedAt: Date;
    }>;
    findAllByUser(userId: string): Promise<({
        shipment: {
            id: string;
            status: string;
            orderId: string;
            carrier: string;
            trackingId: string;
            lastSyncedAt: Date | null;
        };
        payment: {
            id: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            orderId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            provider: string;
            providerRef: string;
        };
        items: {
            id: string;
            orderId: string;
            quantity: number;
            productVariantId: string;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
        }[];
        statusHistory: {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            orderId: string;
            changedAt: Date;
            note: string | null;
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
    getTracking(userId: string, id: string): Promise<{
        id: string;
        status: string;
        orderId: string;
        carrier: string;
        trackingId: string;
        lastSyncedAt: Date | null;
    } | {
        message: string;
    }>;
}
