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
exports.AdminBrandsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminBrandsService = class AdminBrandsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.brand.findMany({ skip, take: limit, orderBy: { name: 'asc' } }),
            this.prisma.brand.count(),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findById(id) {
        const brand = await this.prisma.brand.findUnique({ where: { id }, include: { products: { take: 5 } } });
        if (!brand)
            throw new common_1.NotFoundException('Brand not found');
        return brand;
    }
    async create(data) {
        return this.prisma.brand.create({ data: { name: data.name, description: data.description } });
    }
    async update(id, data) {
        return this.prisma.brand.update({ where: { id }, data });
    }
    async delete(id) {
        return this.prisma.brand.delete({ where: { id } });
    }
};
exports.AdminBrandsService = AdminBrandsService;
exports.AdminBrandsService = AdminBrandsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminBrandsService);
//# sourceMappingURL=admin-brands.service.js.map