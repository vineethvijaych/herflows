"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const consents_module_1 = require("./consents/consents.module");
const preferences_module_1 = require("./preferences/preferences.module");
const products_module_1 = require("./products/products.module");
const kit_templates_module_1 = require("./kit-templates/kit-templates.module");
const subscriptions_module_1 = require("./subscriptions/subscriptions.module");
const orders_module_1 = require("./orders/orders.module");
const rewards_module_1 = require("./rewards/rewards.module");
const referrals_module_1 = require("./referrals/referrals.module");
const cycle_module_1 = require("./cycle/cycle.module");
const education_module_1 = require("./education/education.module");
const reviews_module_1 = require("./reviews/reviews.module");
const wishlist_module_1 = require("./wishlist/wishlist.module");
const support_module_1 = require("./support/support.module");
const admin_auth_module_1 = require("./admin/auth/admin-auth.module");
const dashboard_module_1 = require("./admin/dashboard/dashboard.module");
const admin_users_module_1 = require("./admin/users/admin-users.module");
const admin_orders_module_1 = require("./admin/orders/admin-orders.module");
const admin_products_module_1 = require("./admin/products/admin-products.module");
const admin_subscriptions_module_1 = require("./admin/subscriptions/admin-subscriptions.module");
const admin_reviews_module_1 = require("./admin/reviews/admin-reviews.module");
const admin_education_module_1 = require("./admin/education/admin-education.module");
const admin_policies_module_1 = require("./admin/policies/admin-policies.module");
const admin_consent_logs_module_1 = require("./admin/consent-logs/admin-consent-logs.module");
const admin_audit_logs_module_1 = require("./admin/audit-logs/admin-audit-logs.module");
const admin_rewards_module_1 = require("./admin/rewards/admin-rewards.module");
const admin_support_module_1 = require("./admin/support/admin-support.module");
const admin_brands_module_1 = require("./admin/brands/admin-brands.module");
const admin_categories_module_1 = require("./admin/categories/admin-categories.module");
const admin_coupons_module_1 = require("./admin/coupons/admin-coupons.module");
const admin_roles_module_1 = require("./admin/roles/admin-roles.module");
const admin_admin_users_module_1 = require("./admin/admin-users/admin-admin-users.module");
const admin_settings_module_1 = require("./admin/settings/admin-settings.module");
const admin_inventory_module_1 = require("./admin/inventory/admin-inventory.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            consents_module_1.ConsentsModule,
            preferences_module_1.PreferencesModule,
            products_module_1.ProductsModule,
            kit_templates_module_1.KitTemplatesModule,
            subscriptions_module_1.SubscriptionsModule,
            orders_module_1.OrdersModule,
            rewards_module_1.RewardsModule,
            referrals_module_1.ReferralsModule,
            cycle_module_1.CycleModule,
            education_module_1.EducationModule,
            reviews_module_1.ReviewsModule,
            wishlist_module_1.WishlistModule,
            support_module_1.SupportModule,
            admin_auth_module_1.AdminAuthModule,
            dashboard_module_1.DashboardModule,
            admin_users_module_1.AdminUsersModule,
            admin_orders_module_1.AdminOrdersModule,
            admin_products_module_1.AdminProductsModule,
            admin_subscriptions_module_1.AdminSubscriptionsModule,
            admin_reviews_module_1.AdminReviewsModule,
            admin_education_module_1.AdminEducationModule,
            admin_policies_module_1.AdminPoliciesModule,
            admin_consent_logs_module_1.AdminConsentLogsModule,
            admin_audit_logs_module_1.AdminAuditLogsModule,
            admin_rewards_module_1.AdminRewardsModule,
            admin_support_module_1.AdminSupportModule,
            admin_brands_module_1.AdminBrandsModule,
            admin_categories_module_1.AdminCategoriesModule,
            admin_coupons_module_1.AdminCouponsModule,
            admin_roles_module_1.AdminRolesModule,
            admin_admin_users_module_1.AdminAdminUsersModule,
            admin_settings_module_1.AdminSettingsModule,
            admin_inventory_module_1.AdminInventoryModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map