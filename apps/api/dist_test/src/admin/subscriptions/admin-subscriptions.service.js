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
exports.AdminSubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminSubscriptionsService = class AdminSubscriptionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 20, search, status) {
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.user = { email: { contains: search, mode: 'insensitive' } };
        }
        if (status)
            where.status = status;
        const [data, total] = await Promise.all([
            this.prisma.subscription.findMany({
                where, skip, take: limit,
                include: { user: { select: { id: true, email: true } }, events: { orderBy: { occurredAt: 'desc' }, take: 1 } },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.subscription.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findById(id) {
        return this.prisma.subscription.findUnique({
            where: { id },
            include: { user: { select: { id: true, email: true, phone: true } }, events: { orderBy: { occurredAt: 'desc' } }, orders: { take: 5, orderBy: { placedAt: 'desc' } } },
        });
    }
    async updateStatus(id, status) {
        return this.prisma.subscription.update({
            where: { id },
            data: { status: status, events: { create: { eventType: `admin_${status}`, actor: 'admin' } } },
        });
    }
};
exports.AdminSubscriptionsService = AdminSubscriptionsService;
exports.AdminSubscriptionsService = AdminSubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminSubscriptionsService);
//# sourceMappingURL=admin-subscriptions.service.js.map