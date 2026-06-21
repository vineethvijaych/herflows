import { AdminInventoryService } from './admin-inventory.service';
export declare class AdminInventoryController {
    private service;
    constructor(service: AdminInventoryService);
    findAll(page?: string, limit?: string, lowStock?: string): Promise<{
        data: ({
            product: {
                brand: {
                    name: string;
                };
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            sku: string;
            attributes: import("@prisma/client/runtime/library").JsonValue;
            price: import("@prisma/client/runtime/library").Decimal;
            stockQty: number;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    adjustStock(data: {
        variantId: string;
        delta: number;
        reason: string;
    }, user: {
        id: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        sku: string;
        attributes: import("@prisma/client/runtime/library").JsonValue;
        price: import("@prisma/client/runtime/library").Decimal;
        stockQty: number;
    }>;
}
