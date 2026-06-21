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
exports.AdminSettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminSettingsService = class AdminSettingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSettings() {
        return {
            siteName: 'HerFlows',
            supportEmail: 'support@herflows.com',
            supportPhone: '+1-800-HERFLOWS',
            rewardPointsPerOrder: 10,
            referralRewardPoints: 50,
            maxLoginAttempts: 5,
            maintenanceMode: false,
            currency: 'INR',
            timezone: 'Asia/Kolkata',
        };
    }
    async updateSettings(data) {
        return { ...(await this.getSettings()), ...data };
    }
};
exports.AdminSettingsService = AdminSettingsService;
exports.AdminSettingsService = AdminSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminSettingsService);
//# sourceMappingURL=admin-settings.service.js.map