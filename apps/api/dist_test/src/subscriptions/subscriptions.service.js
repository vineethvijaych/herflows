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
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SubscriptionsService = class SubscriptionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
        const now = new Date();
        const nextDispatch = new Date(now);
        nextDispatch.setDate(nextDispatch.getDate() + 30);
        const editLock = new Date(nextDispatch);
        editLock.setDate(editLock.getDate() - 10);
        return this.prisma.subscription.create({
            data: {
                userId,
                planType: data.planType,
                kitTemplateId: data.kitTemplateId,
                nextDispatchDate: nextDispatch,
                editLockDate: editLock,
                events: {
                    create: {
                        eventType: 'created',
                        actor: 'user',
                    },
                },
            },
            include: { events: true },
        });
    }
    async findByUser(userId) {
        return this.prisma.subscription.findMany({
            where: { userId },
            include: { events: { orderBy: { occurredAt: 'desc' } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async pause(userId, id) {
        const sub = await this.getUserSubscription(id, userId);
        if (sub.status !== 'active')
            throw new common_1.BadRequestException('Subscription is not active');
        return this.prisma.subscription.update({
            where: { id },
            data: {
                status: 'paused',
                events: { create: { eventType: 'paused', actor: 'user' } },
            },
        });
    }
    async resume(userId, id) {
        const sub = await this.getUserSubscription(id, userId);
        if (sub.status !== 'paused')
            throw new common_1.BadRequestException('Subscription is not paused');
        return this.prisma.subscription.update({
            where: { id },
            data: {
                status: 'active',
                events: { create: { eventType: 'resumed', actor: 'user' } },
            },
        });
    }
    async skipNext(userId, id) {
        const sub = await this.getUserSubscription(id, userId);
        if (sub.status !== 'active')
            throw new common_1.BadRequestException('Subscription is not active');
        return this.prisma.subscription.update({
            where: { id },
            data: {
                status: 'skipped_this_cycle',
                events: { create: { eventType: 'skipped_next', actor: 'user' } },
            },
        });
    }
    async editUpcomingKit(userId, id, kitTemplateId) {
        const sub = await this.getUserSubscription(id, userId);
        const now = new Date();
        if (now >= sub.editLockDate) {
            throw new common_1.ForbiddenException('Cannot edit kit within 10 days of dispatch. Edit lock date has passed.');
        }
        return this.prisma.subscription.update({
            where: { id },
            data: {
                kitTemplateId,
                events: { create: { eventType: 'kit_updated', actor: 'user' } },
            },
        });
    }
    async getUserSubscription(id, userId) {
        const sub = await this.prisma.subscription.findFirst({
            where: { id, userId },
        });
        if (!sub)
            throw new common_1.NotFoundException('Subscription not found');
        return sub;
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map