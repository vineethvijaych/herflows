import { AdminReviewsService } from './admin-reviews.service';
export declare class AdminReviewsController {
    private service;
    constructor(service: AdminReviewsService);
    findAll(page?: string, limit?: string, status?: string): Promise<{
        data: ({
            user: {
                email: string;
                id: string;
            };
            product: {
                id: string;
                name: string;
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
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    moderate(id: string, status: 'approved' | 'rejected'): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.ReviewStatus;
        createdAt: Date;
        userId: string;
        productId: string;
        orderId: string;
        rating: number;
        text: string;
        photos: string[];
    }>;
}
