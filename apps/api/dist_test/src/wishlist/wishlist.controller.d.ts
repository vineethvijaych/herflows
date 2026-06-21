import { WishlistService } from './wishlist.service';
export declare class WishlistController {
    private wishlistService;
    constructor(wishlistService: WishlistService);
    add(user: {
        id: string;
    }, productVariantId: string): Promise<{
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
    findAll(user: {
        id: string;
    }): Promise<({
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
    remove(user: {
        id: string;
    }, id: string): Promise<{
        id: string;
        userId: string;
        productVariantId: string;
        addedAt: Date;
    }>;
}
