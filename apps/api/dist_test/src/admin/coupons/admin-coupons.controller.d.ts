import { AdminCouponsService } from './admin-coupons.service';
export declare class AdminCouponsController {
    private service;
    constructor(service: AdminCouponsService);
    findAll(page?: string, limit?: string): Promise<{
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
