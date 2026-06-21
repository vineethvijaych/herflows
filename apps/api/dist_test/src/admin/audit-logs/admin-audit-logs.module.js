"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuditLogsModule = void 0;
const common_1 = require("@nestjs/common");
const admin_audit_logs_service_1 = require("./admin-audit-logs.service");
const admin_audit_logs_controller_1 = require("./admin-audit-logs.controller");
let AdminAuditLogsModule = class AdminAuditLogsModule {
};
exports.AdminAuditLogsModule = AdminAuditLogsModule;
exports.AdminAuditLogsModule = AdminAuditLogsModule = __decorate([
    (0, common_1.Module)({
        controllers: [admin_audit_logs_controller_1.AdminAuditLogsController],
        providers: [admin_audit_logs_service_1.AdminAuditLogsService],
    })
], AdminAuditLogsModule);
//# sourceMappingURL=admin-audit-logs.module.js.map