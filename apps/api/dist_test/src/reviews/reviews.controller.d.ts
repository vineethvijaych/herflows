import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private reviewsService;
    constructor(reviewsService: ReviewsService);
    create(user: {
        id: string;
    }, data: {
        productId: string;
        orderId: string;
        rating: number;
        text: string;
        photos?: string[];
    }): Promise<{
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
    findByProduct(id: string): Promise<({
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
    })[]>;
}
