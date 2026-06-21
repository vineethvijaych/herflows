"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminEducationService = void 0;
const common_1 = require("@nestjs/common");
let AdminEducationService = class AdminEducationService {
    constructor() {
        this.articles = [
            { id: '1', slug: 'understanding-menstrual-products', title: 'Understanding Menstrual Products', excerpt: 'A comprehensive guide to different types of menstrual products.', content: 'There are many types of menstrual products available today...', category: 'Product Guide', imageUrl: null, publishedAt: new Date('2024-01-15') },
            { id: '2', slug: 'building-a-self-care-routine', title: 'Building a Self-Care Routine During Your Cycle', excerpt: 'Learn how to support your body through each phase of your menstrual cycle.', content: 'Your menstrual cycle has four phases: menstrual, follicular, ovulation, and luteal...', category: 'Wellness', imageUrl: null, publishedAt: new Date('2024-02-20') },
            { id: '3', slug: 'sustainable-period-care', title: 'Sustainable Period Care: Making Eco-Friendly Choices', excerpt: 'Discover reusable and eco-friendly menstrual products.', content: 'Making sustainable choices for your period care doesn\'t mean compromising on comfort...', category: 'Sustainability', imageUrl: null, publishedAt: new Date('2024-03-10') },
        ];
    }
    async findAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const data = this.articles.slice(skip, skip + limit);
        return { data, total: this.articles.length, page, limit, totalPages: Math.ceil(this.articles.length / limit) };
    }
    async findById(id) {
        const article = this.articles.find(a => a.id === id);
        if (!article)
            throw new common_1.NotFoundException('Article not found');
        return article;
    }
    async create(data) {
        const article = {
            id: String(this.articles.length + 1),
            slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            title: data.title,
            excerpt: data.excerpt || data.content.substring(0, 100),
            content: data.content,
            category: data.category || 'general',
            imageUrl: data.imageUrl || null,
            publishedAt: new Date(),
        };
        this.articles.unshift(article);
        return article;
    }
    async update(id, data) {
        const idx = this.articles.findIndex(a => a.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException('Article not found');
        const updated = { ...this.articles[idx], ...data };
        this.articles[idx] = updated;
        return updated;
    }
    async delete(id) {
        const idx = this.articles.findIndex(a => a.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException('Article not found');
        this.articles.splice(idx, 1);
        return { success: true };
    }
};
exports.AdminEducationService = AdminEducationService;
exports.AdminEducationService = AdminEducationService = __decorate([
    (0, common_1.Injectable)()
], AdminEducationService);
//# sourceMappingURL=admin-education.service.js.map