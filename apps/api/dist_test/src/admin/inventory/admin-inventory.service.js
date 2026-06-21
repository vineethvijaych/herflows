"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminInventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminInventoryService = class AdminInventoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 20, lowStock) {
        const skip = (page - 1) * limit;
        const where = {};
        if (lowStock === 'true')
            where.stockQty = { lte: 10 };
        const [data, total] = await Promise.all([
            this.prisma.productVariant.findMany({
                where, skip, take: limit,
                include: { product: { select: { id: true, name: true, brand: { select: { name: true } } } } },
                orderBy: { stockQty: 'asc' },
            }),
            this.prisma.productVariant.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async adjustStock(variantId, delta, reason, adminUserId) {
        const variant = await this.prisma.productVariant.update({
            where: { id: variantId },
            data: { stockQty: { increment: delta } },
        });
        await this.prisma.inventoryAdjustment.create({
            data: { productVariantId: variantId, delta, reason, adminUserId },
        });
        return variant;
    }
};
exports.AdminInventoryService = AdminInventoryService;
exports.AdminInventoryService = AdminInventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminInventoryService);
//# sourceMappingURL=admin-inventory.service.js.map