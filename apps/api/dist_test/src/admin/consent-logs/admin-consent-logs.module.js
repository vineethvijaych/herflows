"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminConsentLogsModule = void 0;
const common_1 = require("@nestjs/common");
const admin_consent_logs_service_1 = require("./admin-consent-logs.service");
const admin_consent_logs_controller_1 = require("./admin-consent-logs.controller");
let AdminConsentLogsModule = class AdminConsentLogsModule {
};
exports.AdminConsentLogsModule = AdminConsentLogsModule;
exports.AdminConsentLogsModule = AdminConsentLogsModule = __decorate([
    (0, common_1.Module)({
        controllers: [admin_consent_logs_controller_1.AdminConsentLogsController],
        providers: [admin_consent_logs_service_1.AdminConsentLogsService],
    })
], AdminConsentLogsModule);
//# sourceMappingURL=admin-consent-logs.module.js.map