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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        const [activeUsers, activeOrders, activeSubscriptions, lowStockItems, totalRevenue] = await Promise.all([
            this.prisma.user.count({ where: { status: 'active' } }),
            this.prisma.order.count({ where: { status: { notIn: ['cancelled', 'refunded', 'delivered'] } } }),
            this.prisma.subscription.count({ where: { status: 'active' } }),
            this.prisma.productVariant.count({ where: { stockQty: { lte: 10 } } }),
            this.prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: { notIn: ['cancelled', 'refunded'] } } }),
        ]);
        return {
            activeUsers,
            activeOrders,
            activeSubscriptions,
            lowStockItems,
            totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
        };
    }
    async getRevenueData() {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const orders = await this.prisma.order.findMany({
            where: { placedAt: { gte: sixMonthsAgo }, status: { notIn: ['cancelled', 'refunded'] } },
            select: { placedAt: true, totalAmount: true },
            orderBy: { placedAt: 'asc' },
        });
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const revenueMap = {};
        for (const order of orders) {
            const key = monthNames[order.placedAt.getMonth()];
            revenueMap[key] = (revenueMap[key] || 0) + Number(order.totalAmount);
        }
        const months = [];
        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - (5 - i));
            const key = monthNames[d.getMonth()];
            months.push({ month: key, revenue: revenueMap[key] || 0 });
        }
        return months;
    }
    async getRecentOrders(limit = 5) {
        return this.prisma.order.findMany({
            take: limit,
            orderBy: { placedAt: 'desc' },
            include: {
                user: { select: { id: true, email: true } },
                items: { take: 1 },
                payment: { select: { status: true } },
            },
        });
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map