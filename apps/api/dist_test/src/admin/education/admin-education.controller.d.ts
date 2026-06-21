import { AdminEducationService } from './admin-education.service';
export declare class AdminEducationController {
    private service;
    constructor(service: AdminEducationService);
    findAll(page?: string, limit?: string): Promise<{
        data: {
            id: string;
            slug: string;
            title: string;
            excerpt: string;
            content: string;
            category: string;
            imageUrl: any;
            publishedAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<{
        id: string;
        slug: string;
        title: string;
        excerpt: string;
        content: string;
        category: string;
        imageUrl: any;
        publishedAt: Date;
    }>;
    create(data: {
        title: string;
        content: string;
        category?: string;
        imageUrl?: string;
    }): Promise<{
        id: string;
        slug: string;
        title: string;
        excerpt: string;
        content: string;
        category: string;
        imageUrl: string;
        publishedAt: Date;
    }>;
    update(id: string, data: any): Promise<{
        title: string;
        content: string;
        excerpt: string;
        category: string;
        imageUrl: any;
        id: string;
        slug: string;
        publishedAt: Date;
    }>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
}
