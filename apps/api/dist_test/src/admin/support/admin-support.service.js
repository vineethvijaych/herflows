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
exports.AdminSupportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminSupportService = class AdminSupportService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 20, status) {
        const skip = (page - 1) * limit;
        const where = {};
        if (status)
            where.status = status;
        const [data, total] = await Promise.all([
            this.prisma.supportTicket.findMany({
                where, skip, take: limit,
                include: { user: { select: { id: true, email: true } }, messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.supportTicket.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findById(id) {
        return this.prisma.supportTicket.findUnique({
            where: { id },
            include: { user: { select: { id: true, email: true } }, messages: { orderBy: { createdAt: 'asc' } } },
        });
    }
    async updateStatus(id, status) {
        return this.prisma.supportTicket.update({ where: { id }, data: { status: status } });
    }
    async reply(id, adminId, message) {
        return this.prisma.supportTicketMessage.create({
            data: { ticketId: id, senderType: 'admin', message },
        });
    }
};
exports.AdminSupportService = AdminSupportService;
exports.AdminSupportService = AdminSupportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminSupportService);
//# sourceMappingURL=admin-support.service.js.map