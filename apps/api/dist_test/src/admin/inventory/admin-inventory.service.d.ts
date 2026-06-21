import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminInventoryService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, lowStock?: string): Promise<{
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
    adjustStock(variantId: string, delta: number, reason: string, adminUserId: string): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        sku: string;
        attributes: import("@prisma/client/runtime/library").JsonValue;
        price: import("@prisma/client/runtime/library").Decimal;
        stockQty: number;
    }>;
}
