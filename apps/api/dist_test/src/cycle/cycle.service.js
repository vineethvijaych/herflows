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
exports.CycleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CycleService = class CycleService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createEntry(userId, data) {
        return this.prisma.cycleEntry.create({
            data: {
                userId,
                date: new Date(data.date),
                flowLevel: data.flowLevel,
                mood: data.mood,
                symptoms: data.symptoms || [],
                notes: data.notes,
            },
        });
    }
    async getEstimate(userId) {
        const entries = await this.prisma.cycleEntry.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
            take: 6,
        });
        let estimatedStartDate;
        if (entries.length >= 2) {
            const sorted = [...entries].sort((a, b) => a.date.getTime() - b.date.getTime());
            const avgCycle = (sorted[sorted.length - 1].date.getTime() - sorted[0].date.getTime()) / (sorted.length - 1);
            const avgCycleDays = Math.round(avgCycle / (1000 * 60 * 60 * 24));
            const lastDate = sorted[sorted.length - 1].date;
            estimatedStartDate = new Date(lastDate.getTime() + avgCycleDays * 24 * 60 * 60 * 1000);
        }
        else {
            estimatedStartDate = new Date();
            estimatedStartDate.setDate(estimatedStartDate.getDate() + 28);
        }
        return this.prisma.cycleEstimate.create({
            data: {
                userId,
                estimatedStartDate,
                disclaimerText: 'This estimate is not medical advice and may not be accurate. It is based solely on dates you have entered.',
            },
        });
    }
    async getEntries(userId) {
        return this.prisma.cycleEntry.findMany({
            where: { userId },
            orderBy: { date: 'asc' },
        });
    }
};
exports.CycleService = CycleService;
exports.CycleService = CycleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CycleService);
//# sourceMappingURL=cycle.service.js.map