export declare class AdminCouponsService {
    private coupons;
    findAll(page?: number, limit?: number): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<any>;
    create(data: {
        code: string;
        discountPercent?: number;
        discountAmount?: number;
        maxUses?: number;
        expiresAt?: string;
    }): Promise<{
        id: string;
        code: string;
        discountPercent: number;
        discountAmount: number;
        maxUses: number;
        usedCount: number;
        expiresAt: string;
        createdAt: Date;
        active: boolean;
    }>;
    update(id: string, data: any): Promise<any>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
}
