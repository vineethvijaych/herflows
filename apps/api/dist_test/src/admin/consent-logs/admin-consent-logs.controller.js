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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminConsentLogsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const admin_consent_logs_service_1 = require("./admin-consent-logs.service");
let AdminConsentLogsController = class AdminConsentLogsController {
    constructor(service) {
        this.service = service;
    }
    async findAll(page, limit) {
        return this.service.findAll(page ? parseInt(page) : undefined, limit ? parseInt(limit) : undefined);
    }
};
exports.AdminConsentLogsController = AdminConsentLogsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminConsentLogsController.prototype, "findAll", null);
exports.AdminConsentLogsController = AdminConsentLogsController = __decorate([
    (0, common_1.Controller)('admin/consent-logs'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('admin-jwt')),
    __metadata("design:paramtypes", [admin_consent_logs_service_1.AdminConsentLogsService])
], AdminConsentLogsController);
//# sourceMappingURL=admin-consent-logs.controller.js.map