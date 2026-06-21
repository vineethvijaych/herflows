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
exports.AdminProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminProductsService = class AdminProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 20, search) {
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { brand: { name: { contains: search, mode: 'insensitive' } } },
            ];
        }
        const [data, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                include: {
                    brand: true,
                    category: true,
                    variants: true,
                    images: { orderBy: { sortOrder: 'asc' } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.product.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { brand: true, category: true, variants: true, images: { orderBy: { sortOrder: 'asc' } } },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async create(data) {
        return this.prisma.product.create({
            data: {
                name: data.name,
                description: data.description || '',
                brandId: data.brandId,
                categoryId: data.categoryId,
                materials: data.materials || [],
                status: data.status || 'active',
            },
            include: { brand: true, category: true, variants: true, images: true },
        });
    }
    async update(id, data) {
        const updateData = { ...data };
        if (data.brandId) {
            updateData.brand = { connect: { id: data.brandId } };
            delete updateData.brandId;
        }
        if (data.categoryId) {
            updateData.category = { connect: { id: data.categoryId } };
            delete updateData.categoryId;
        }
        return this.prisma.product.update({
            where: { id },
            data: updateData,
            include: { brand: true, category: true, variants: true, images: true },
        });
    }
    async delete(id) {
        return this.prisma.product.delete({ where: { id } });
    }
    async createVariant(productId, data) {
        return this.prisma.productVariant.create({
            data: { productId, sku: data.sku, attributes: data.attributes, price: data.price, stockQty: data.stockQty || 0 },
        });
    }
    async updateVariant(id, data) {
        return this.prisma.productVariant.update({ where: { id }, data });
    }
    async deleteVariant(id) {
        return this.prisma.productVariant.delete({ where: { id } });
    }
    async addImage(productId, url) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const maxSort = await this.prisma.productImage.aggregate({
            where: { productId },
            _max: { sortOrder: true },
        });
        const sortOrder = (maxSort._max.sortOrder ?? -1) + 1;
        return this.prisma.productImage.create({
            data: { productId, url, sortOrder },
        });
    }
    async removeImage(imageId) {
        const image = await this.prisma.productImage.findUnique({ where: { id: imageId } });
        if (!image)
            throw new common_1.NotFoundException('Image not found');
        return this.prisma.productImage.delete({ where: { id: imageId } });
    }
};
exports.AdminProductsService = AdminProductsService;
exports.AdminProductsService = AdminProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminProductsService);
//# sourceMappingURL=admin-products.service.js.map