"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCouponsModule = void 0;
const common_1 = require("@nestjs/common");
const admin_coupons_service_1 = require("./admin-coupons.service");
const admin_coupons_controller_1 = require("./admin-coupons.controller");
let AdminCouponsModule = class AdminCouponsModule {
};
exports.AdminCouponsModule = AdminCouponsModule;
exports.AdminCouponsModule = AdminCouponsModule = __decorate([
    (0, common_1.Module)({
        controllers: [admin_coupons_controller_1.AdminCouponsController],
        providers: [admin_coupons_service_1.AdminCouponsService],
    })
], AdminCouponsModule);
//# sourceMappingURL=admin-coupons.module.js.map