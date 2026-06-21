import { AdminProductsService } from './admin-products.service';
export declare class AdminProductsController {
    private adminProductsService;
    constructor(adminProductsService: AdminProductsService);
    findAll(page?: string, limit?: string, search?: string): Promise<{
        data: ({
            brand: {
                id: string;
                name: string;
                description: string | null;
            };
            category: {
                id: string;
                name: string;
                parentId: string | null;
                sustainabilityTag: string | null;
            };
            variants: {
                id: string;
                createdAt: Date;
                productId: string;
                sku: string;
                attributes: import("@prisma/client/runtime/library").JsonValue;
                price: import("@prisma/client/runtime/library").Decimal;
                stockQty: number;
            }[];
            images: {
                id: string;
                sortOrder: number;
                productId: string;
                url: string;
            }[];
        } & {
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
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<{
        brand: {
            id: string;
            name: string;
            description: string | null;
        };
        category: {
            id: string;
            name: string;
            parentId: string | null;
            sustainabilityTag: string | null;
        };
        variants: {
            id: string;
            createdAt: Date;
            productId: string;
            sku: string;
            attributes: import("@prisma/client/runtime/library").JsonValue;
            price: import("@prisma/client/runtime/library").Decimal;
            stockQty: number;
        }[];
        images: {
            id: string;
            sortOrder: number;
            productId: string;
            url: string;
        }[];
    } & {
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
    }>;
    create(data: {
        name: string;
        description?: string;
        brandId: string;
        categoryId: string;
    }): Promise<{
        brand: {
            id: string;
            name: string;
            description: string | null;
        };
        category: {
            id: string;
            name: string;
            parentId: string | null;
            sustainabilityTag: string | null;
        };
        variants: {
            id: string;
            createdAt: Date;
            productId: string;
            sku: string;
            attributes: import("@prisma/client/runtime/library").JsonValue;
            price: import("@prisma/client/runtime/library").Decimal;
            stockQty: number;
        }[];
        images: {
            id: string;
            sortOrder: number;
            productId: string;
            url: string;
        }[];
    } & {
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
    }>;
    update(id: string, data: any): Promise<{
        brand: {
            id: string;
            name: string;
            description: string | null;
        };
        category: {
            id: string;
            name: string;
            parentId: string | null;
            sustainabilityTag: string | null;
        };
        variants: {
            id: string;
            createdAt: Date;
            productId: string;
            sku: string;
            attributes: import("@prisma/client/runtime/library").JsonValue;
            price: import("@prisma/client/runtime/library").Decimal;
            stockQty: number;
        }[];
        images: {
            id: string;
            sortOrder: number;
            productId: string;
            url: string;
        }[];
    } & {
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
    }>;
    delete(id: string): Promise<{
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
    }>;
    createVariant(id: string, data: {
        sku: string;
        attributes: any;
        price: number;
        stockQty?: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        sku: string;
        attributes: import("@prisma/client/runtime/library").JsonValue;
        price: import("@prisma/client/runtime/library").Decimal;
        stockQty: number;
    }>;
    updateVariant(variantId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        sku: string;
        attributes: import("@prisma/client/runtime/library").JsonValue;
        price: import("@prisma/client/runtime/library").Decimal;
        stockQty: number;
    }>;
    deleteVariant(variantId: string): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        sku: string;
        attributes: import("@prisma/client/runtime/library").JsonValue;
        price: import("@prisma/client/runtime/library").Decimal;
        stockQty: number;
    }>;
    addImage(id: string, data: {
        url: string;
    }): Promise<{
        id: string;
        sortOrder: number;
        productId: string;
        url: string;
    }>;
    removeImage(imageId: string): Promise<{
        id: string;
        sortOrder: number;
        productId: string;
        url: string;
    }>;
}
