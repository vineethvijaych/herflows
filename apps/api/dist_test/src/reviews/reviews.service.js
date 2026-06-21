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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReviewsService = class ReviewsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
        const order = await this.prisma.order.findFirst({
            where: { id: data.orderId, userId, status: 'delivered' },
        });
        if (!order) {
            throw new common_1.ForbiddenException('Only verified buyers with delivered orders can leave reviews');
        }
        const existing = await this.prisma.review.findUnique({
            where: { userId_orderId_productId: { userId, orderId: data.orderId, productId: data.productId } },
        });
        if (existing) {
            throw new common_1.ForbiddenException('You have already reviewed this product for this order');
        }
        const review = await this.prisma.review.create({
            data: {
                userId,
                productId: data.productId,
                orderId: data.orderId,
                rating: data.rating,
                text: data.text,
                photos: data.photos || [],
            },
        });
        await this.updateProductRating(data.productId);
        return review;
    }
    async findByProduct(productId) {
        return this.prisma.review.findMany({
            where: { productId, status: 'approved' },
            include: { user: { select: { id: true, email: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateProductRating(productId) {
        const result = await this.prisma.review.aggregate({
            where: { productId, status: 'approved' },
            _avg: { rating: true },
            _count: { rating: true },
        });
        await this.prisma.product.update({
            where: { id: productId },
            data: {
                averageRating: result._avg.rating || 0,
                reviewCount: result._count.rating,
            },
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map