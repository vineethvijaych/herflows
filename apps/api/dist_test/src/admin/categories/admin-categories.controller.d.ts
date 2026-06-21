import { AdminCategoriesService } from './admin-categories.service';
export declare class AdminCategoriesController {
    private service;
    constructor(service: AdminCategoriesService);
    findAll(page?: string, limit?: string): Promise<{
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
    update(id: string, data: any): Promise<{
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
