import { PrismaService } from '../prisma/prisma.service';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, data: {
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
    findByProduct(productId: string): Promise<({
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
    private updateProductRating;
}
