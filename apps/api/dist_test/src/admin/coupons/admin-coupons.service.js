"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCouponsService = void 0;
const common_1 = require("@nestjs/common");
let AdminCouponsService = class AdminCouponsService {
    constructor() {
        this.coupons = [
            { id: '1', code: 'WELCOME20', discountPercent: 20, maxUses: 100, usedCount: 45, expiresAt: '2025-12-31T00:00:00.000Z', createdAt: new Date('2024-01-01'), active: true },
            { id: '2', code: 'FREESHIP', discountAmount: 50, maxUses: 200, usedCount: 78, expiresAt: '2025-12-31T00:00:00.000Z', createdAt: new Date('2024-02-01'), active: true },
            { id: '3', code: 'HERFLOWS10', discountPercent: 10, maxUses: 500, usedCount: 120, expiresAt: '2025-06-30T00:00:00.000Z', createdAt: new Date('2024-03-15'), active: true },
        ];
    }
    async findAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const data = this.coupons.slice(skip, skip + limit);
        return { data, total: this.coupons.length, page, limit, totalPages: Math.ceil(this.coupons.length / limit) };
    }
    async findById(id) {
        const coupon = this.coupons.find(c => c.id === id);
        if (!coupon)
            throw new common_1.NotFoundException('Coupon not found');
        return coupon;
    }
    async create(data) {
        const coupon = {
            id: String(this.coupons.length + 1),
            code: data.code.toUpperCase(),
            discountPercent: data.discountPercent,
            discountAmount: data.discountAmount,
            maxUses: data.maxUses || null,
            usedCount: 0,
            expiresAt: data.expiresAt || null,
            createdAt: new Date(),
            active: true,
        };
        this.coupons.unshift(coupon);
        return coupon;
    }
    async update(id, data) {
        const idx = this.coupons.findIndex(c => c.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException('Coupon not found');
        this.coupons[idx] = { ...this.coupons[idx], ...data };
        return this.coupons[idx];
    }
    async delete(id) {
        const idx = this.coupons.findIndex(c => c.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException('Coupon not found');
        this.coupons.splice(idx, 1);
        return { success: true };
    }
};
exports.AdminCouponsService = AdminCouponsService;
exports.AdminCouponsService = AdminCouponsService = __decorate([
    (0, common_1.Injectable)()
], AdminCouponsService);
//# sourceMappingURL=admin-coupons.service.js.map