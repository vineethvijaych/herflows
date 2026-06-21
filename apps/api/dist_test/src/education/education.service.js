"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EducationService = void 0;
const common_1 = require("@nestjs/common");
let EducationService = class EducationService {
    constructor() {
        this.articles = [
            {
                id: '1',
                slug: 'understanding-menstrual-products',
                title: 'Understanding Menstrual Products',
                excerpt: 'A comprehensive guide to different types of menstrual products and how to choose what works for you.',
                content: 'There are many types of menstrual products available today. Sanitary pads, tampons, menstrual cups, and period underwear each have their own benefits. The right choice depends on your flow, lifestyle, and comfort preferences...',
                category: 'Product Guide',
                publishedAt: new Date('2024-01-15'),
            },
            {
                id: '2',
                slug: 'building-a-self-care-routine',
                title: 'Building a Self-Care Routine During Your Cycle',
                excerpt: 'Learn how to support your body through each phase of your menstrual cycle with simple self-care practices.',
                content: 'Your menstrual cycle has four phases: menstrual, follicular, ovulation, and luteal. Each phase brings different hormonal changes that can affect your energy, mood, and physical needs...',
                category: 'Wellness',
                publishedAt: new Date('2024-02-20'),
            },
            {
                id: '3',
                slug: 'sustainable-period-care',
                title: 'Sustainable Period Care: Making Eco-Friendly Choices',
                excerpt: 'Discover reusable and eco-friendly menstrual products that are better for you and the planet.',
                content: 'Making sustainable choices for your period care doesn\'t mean compromising on comfort or protection. Reusable products like menstrual cups, cloth pads, and period underwear have come a long way...',
                category: 'Sustainability',
                publishedAt: new Date('2024-03-10'),
            },
        ];
    }
    async findAll() {
        return this.articles.map(({ content, ...rest }) => rest);
    }
    async findBySlug(slug) {
        const article = this.articles.find(a => a.slug === slug);
        if (!article)
            throw new common_1.NotFoundException('Article not found');
        return article;
    }
};
exports.EducationService = EducationService;
exports.EducationService = EducationService = __decorate([
    (0, common_1.Injectable)()
], EducationService);
//# sourceMappingURL=education.service.js.map