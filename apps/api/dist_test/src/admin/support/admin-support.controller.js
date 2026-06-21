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
exports.AdminSupportController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const admin_support_service_1 = require("./admin-support.service");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let AdminSupportController = class AdminSupportController {
    constructor(service) {
        this.service = service;
    }
    async findAll(page, limit, status) {
        return this.service.findAll(page ? parseInt(page) : undefined, limit ? parseInt(limit) : undefined, status);
    }
    async findById(id) {
        return this.service.findById(id);
    }
    async updateStatus(id, status) {
        return this.service.updateStatus(id, status);
    }
    async reply(id, user, message) {
        return this.service.reply(id, user.id, message);
    }
};
exports.AdminSupportController = AdminSupportController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminSupportController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminSupportController.prototype, "findById", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminSupportController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/reply'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)('message')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], AdminSupportController.prototype, "reply", null);
exports.AdminSupportController = AdminSupportController = __decorate([
    (0, common_1.Controller)('admin/support'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('admin-jwt')),
    __metadata("design:paramtypes", [admin_support_service_1.AdminSupportService])
], AdminSupportController);
//# sourceMappingURL=admin-support.controller.js.map