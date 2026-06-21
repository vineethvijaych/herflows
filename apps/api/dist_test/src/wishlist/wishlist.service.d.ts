import { PrismaService } from '../prisma/prisma.service';
export declare class WishlistService {
    private prisma;
    constructor(prisma: PrismaService);
    add(userId: string, productVariantId: string): Promise<{
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
        userId: string;
        productVariantId: string;
        addedAt: Date;
    }>;
    findAll(userId: string): Promise<({
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
        userId: string;
        productVariantId: string;
        addedAt: Date;
    })[]>;
    remove(userId: string, id: string): Promise<{
        id: string;
        userId: string;
        productVariantId: string;
        addedAt: Date;
    }>;
}
