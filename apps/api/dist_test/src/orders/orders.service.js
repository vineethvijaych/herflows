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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrdersService = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
        const variants = await this.prisma.productVariant.findMany({
            where: { id: { in: data.items.map(i => i.productVariantId) } },
        });
        const variantMap = new Map(variants.map((v) => [v.id, v]));
        const orderItems = data.items.map(item => {
            const variant = variantMap.get(item.productVariantId);
            if (!variant)
                throw new common_1.NotFoundException(`Variant ${item.productVariantId} not found`);
            return {
                productVariantId: item.productVariantId,
                quantity: item.quantity,
                unitPrice: Number(variant.price),
            };
        });
        const totalAmount = orderItems.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);
        return this.prisma.order.create({
            data: {
                userId,
                subscriptionId: data.subscriptionId,
                totalAmount,
                items: { create: orderItems },
                statusHistory: { create: { status: 'kit_confirmed' } },
            },
            include: {
                items: true,
                statusHistory: true,
                payment: true,
                shipment: true,
            },
        });
    }
    async findById(userId, id) {
        const order = await this.prisma.order.findFirst({
            where: { id, userId },
            include: {
                items: { include: { variant: { include: { product: true } } } },
                statusHistory: { orderBy: { changedAt: 'desc' } },
                payment: true,
                shipment: true,
            },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async findAllByUser(userId) {
        return this.prisma.order.findMany({
            where: { userId },
            include: {
                items: true,
                statusHistory: { orderBy: { changedAt: 'desc' }, take: 1 },
                payment: true,
                shipment: true,
            },
            orderBy: { placedAt: 'desc' },
        });
    }
    async getTracking(userId, id) {
        const order = await this.findById(userId, id);
        return order.shipment || { message: 'No tracking information available yet' };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map