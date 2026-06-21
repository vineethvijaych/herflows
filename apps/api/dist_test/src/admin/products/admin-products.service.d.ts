import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, search?: string): Promise<{
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
        materials?: string[];
        status?: string;
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
    update(id: string, data: {
        name?: string;
        description?: string;
        brandId?: string;
        categoryId?: string;
        materials?: string[];
        status?: string;
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
    createVariant(productId: string, data: {
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
    updateVariant(id: string, data: {
        sku?: string;
        attributes?: any;
        price?: number;
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
    deleteVariant(id: string): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        sku: string;
        attributes: import("@prisma/client/runtime/library").JsonValue;
        price: import("@prisma/client/runtime/library").Decimal;
        stockQty: number;
    }>;
    addImage(productId: string, url: string): Promise<{
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
