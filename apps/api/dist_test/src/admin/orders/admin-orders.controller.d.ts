import { AdminOrdersService } from './admin-orders.service';
export declare class AdminOrdersController {
    private adminOrdersService;
    constructor(adminOrdersService: AdminOrdersService);
    findAll(page?: string, limit?: string, search?: string, status?: string): Promise<{
        data: ({
            user: {
                email: string;
                id: string;
            };
            shipment: {
                id: string;
                status: string;
                orderId: string;
                carrier: string;
                trackingId: string;
                lastSyncedAt: Date | null;
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
    updateStatus(id: string, status: string, note?: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        updatedAt: Date;
        userId: string;
        subscriptionId: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        placedAt: Date;
    }>;
}
