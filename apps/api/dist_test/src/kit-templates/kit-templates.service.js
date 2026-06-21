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
exports.KitTemplatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let KitTemplatesService = class KitTemplatesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
        if (data.items.length === 0) {
            data.items = [];
        }
        return this.prisma.kitTemplate.create({
            data: {
                userId,
                name: data.name,
                items: {
                    create: data.items.map(item => ({
                        productVariantId: item.productVariantId,
                        quantity: item.quantity,
                    })),
                },
            },
            include: { items: true },
        });
    }
    async update(id, userId, data) {
        const template = await this.prisma.kitTemplate.findFirst({
            where: { id, userId },
        });
        if (!template)
            throw new common_1.NotFoundException('Kit template not found');
        if (data.items) {
            await this.prisma.kitTemplateItem.deleteMany({ where: { kitTemplateId: id } });
            await this.prisma.kitTemplateItem.createMany({
                data: data.items.map(item => ({
                    kitTemplateId: id,
                    productVariantId: item.productVariantId,
                    quantity: item.quantity,
                })),
            });
        }
        return this.prisma.kitTemplate.update({
            where: { id },
            data: { name: data.name },
            include: { items: true },
        });
    }
    async findAllByUser(userId) {
        return this.prisma.kitTemplate.findMany({
            where: { userId },
            include: { items: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async setActive(userId, id) {
        await this.prisma.kitTemplate.updateMany({
            where: { userId, isActiveSource: true },
            data: { isActiveSource: false },
        });
        return this.prisma.kitTemplate.update({
            where: { id },
            data: { isActiveSource: true },
        });
    }
};
exports.KitTemplatesService = KitTemplatesService;
exports.KitTemplatesService = KitTemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], KitTemplatesService);
//# sourceMappingURL=kit-templates.service.js.map