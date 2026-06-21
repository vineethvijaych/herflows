import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminCategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number): Promise<{
        data: {
            id: string;
            name: string;
            parentId: string | null;
            sustainabilityTag: string | null;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<{
        parent: {
            id: string;
            name: string;
            parentId: string | null;
            sustainabilityTag: string | null;
        };
        children: {
            id: string;
            name: string;
            parentId: string | null;
            sustainabilityTag: string | null;
        }[];
    } & {
        id: string;
        name: string;
        parentId: string | null;
        sustainabilityTag: string | null;
    }>;
    create(data: {
        name: string;
        parentId?: string;
        sustainabilityTag?: string;
    }): Promise<{
        id: string;
        name: string;
        parentId: string | null;
        sustainabilityTag: string | null;
    }>;
    update(id: string, data: {
        name?: string;
        parentId?: string;
        sustainabilityTag?: string;
    }): Promise<{
        id: string;
        name: string;
        parentId: string | null;
        sustainabilityTag: string | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        name: string;
        parentId: string | null;
        sustainabilityTag: string | null;
    }>;
}
