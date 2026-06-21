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
exports.AdminOrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminOrdersService = class AdminOrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 20, search, status) {
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { id: { contains: search, mode: 'insensitive' } },
                { user: { email: { contains: search, mode: 'insensitive' } } },
            ];
        }
        if (status)
            where.status = status;
        const [data, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: { select: { id: true, email: true } },
                    items: true,
                    payment: { select: { status: true } },
                    shipment: true,
                    statusHistory: { orderBy: { changedAt: 'desc' }, take: 1 },
                },
                orderBy: { placedAt: 'desc' },
            }),
            this.prisma.order.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findById(id) {
        return this.prisma.order.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, email: true, phone: true } },
                items: { include: { variant: { include: { product: true } } } },
                payment: true,
                shipment: true,
                statusHistory: { orderBy: { changedAt: 'desc' } },
            },
        });
    }
    async updateStatus(id, status, note) {
        return this.prisma.order.update({
            where: { id },
            data: {
                status: status,
                statusHistory: { create: { status: status, note } },
            },
        });
    }
};
exports.AdminOrdersService = AdminOrdersService;
exports.AdminOrdersService = AdminOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminOrdersService);
//# sourceMappingURL=admin-orders.service.js.map