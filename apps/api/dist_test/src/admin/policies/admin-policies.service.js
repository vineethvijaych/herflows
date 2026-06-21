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
exports.AdminPoliciesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminPoliciesService = class AdminPoliciesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.policyDocument.findMany({ skip, take: limit, orderBy: { publishedAt: 'desc' } }),
            this.prisma.policyDocument.count(),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findById(id) {
        const doc = await this.prisma.policyDocument.findUnique({ where: { id } });
        if (!doc)
            throw new common_1.NotFoundException('Policy not found');
        return doc;
    }
    async create(data) {
        return this.prisma.policyDocument.create({ data: { type: data.type, version: data.version, content: data.content } });
    }
    async update(id, data) {
        return this.prisma.policyDocument.update({ where: { id }, data });
    }
};
exports.AdminPoliciesService = AdminPoliciesService;
exports.AdminPoliciesService = AdminPoliciesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminPoliciesService);
//# sourceMappingURL=admin-policies.service.js.map