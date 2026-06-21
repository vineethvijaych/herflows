"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAdminUsersModule = void 0;
const common_1 = require("@nestjs/common");
const admin_admin_users_service_1 = require("./admin-admin-users.service");
const admin_admin_users_controller_1 = require("./admin-admin-users.controller");
let AdminAdminUsersModule = class AdminAdminUsersModule {
};
exports.AdminAdminUsersModule = AdminAdminUsersModule;
exports.AdminAdminUsersModule = AdminAdminUsersModule = __decorate([
    (0, common_1.Module)({
        controllers: [admin_admin_users_controller_1.AdminAdminUsersController],
        providers: [admin_admin_users_service_1.AdminAdminUsersService],
    })
], AdminAdminUsersModule);
//# sourceMappingURL=admin-admin-users.module.js.map