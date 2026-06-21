import { ProductsService } from './products.service';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    findAll(category?: string, brand?: string, priceMin?: string, priceMax?: string, sustainability?: string, search?: string, page?: string, limit?: string): Promise<{
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
        reviews: ({
            user: {
                email: string;
                id: string;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.ReviewStatus;
            createdAt: Date;
            userId: string;
            productId: string;
            orderId: string;
            rating: number;
            text: string;
            photos: string[];
        })[];
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
}
