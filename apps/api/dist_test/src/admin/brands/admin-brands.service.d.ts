import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminBrandsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number): Promise<{
        data: {
            id: string;
            name: string;
            description: string | null;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<{
        products: {
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
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
    }>;
    create(data: {
        name: string;
        description?: string;
    }): Promise<{
        id: string;
        name: string;
        description: string | null;
    }>;
    update(id: string, data: {
        name?: string;
        description?: string;
    }): Promise<{
        id: string;
        name: string;
        description: string | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
    }>;
}
