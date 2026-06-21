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
exports.WishlistService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WishlistService = class WishlistService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async add(userId, productVariantId) {
        const existing = await this.prisma.wishlistItem.findUnique({
            where: { userId_productVariantId: { userId, productVariantId } },
        });
        if (existing) {
            throw new common_1.ConflictException('Item already in wishlist');
        }
        return this.prisma.wishlistItem.create({
            data: { userId, productVariantId },
            include: { variant: { include: { product: true } } },
        });
    }
    async findAll(userId) {
        return this.prisma.wishlistItem.findMany({
            where: { userId },
            include: { variant: { include: { product: true } } },
            orderBy: { addedAt: 'desc' },
        });
    }
    async remove(userId, id) {
        const item = await this.prisma.wishlistItem.findFirst({
            where: { id, userId },
        });
        if (!item)
            throw new common_1.NotFoundException('Wishlist item not found');
        return this.prisma.wishlistItem.delete({ where: { id } });
    }
};
exports.WishlistService = WishlistService;
exports.WishlistService = WishlistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WishlistService);
//# sourceMappingURL=wishlist.service.js.map