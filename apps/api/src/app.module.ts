import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConsentsModule } from './consents/consents.module';
import { PreferencesModule } from './preferences/preferences.module';
import { ProductsModule } from './products/products.module';
import { KitTemplatesModule } from './kit-templates/kit-templates.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { OrdersModule } from './orders/orders.module';
import { RewardsModule } from './rewards/rewards.module';
import { ReferralsModule } from './referrals/referrals.module';
import { CycleModule } from './cycle/cycle.module';
import { EducationModule } from './education/education.module';
import { ReviewsModule } from './reviews/reviews.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { SupportModule } from './support/support.module';
import { AdminAuthModule } from './admin/auth/admin-auth.module';
import { DashboardModule } from './admin/dashboard/dashboard.module';
import { AdminUsersModule } from './admin/users/admin-users.module';
import { AdminOrdersModule } from './admin/orders/admin-orders.module';
import { AdminProductsModule } from './admin/products/admin-products.module';
import { AdminSubscriptionsModule } from './admin/subscriptions/admin-subscriptions.module';
import { AdminReviewsModule } from './admin/reviews/admin-reviews.module';
import { AdminEducationModule } from './admin/education/admin-education.module';
import { AdminPoliciesModule } from './admin/policies/admin-policies.module';
import { AdminConsentLogsModule } from './admin/consent-logs/admin-consent-logs.module';
import { AdminAuditLogsModule } from './admin/audit-logs/admin-audit-logs.module';
import { AdminRewardsModule } from './admin/rewards/admin-rewards.module';
import { AdminSupportModule } from './admin/support/admin-support.module';
import { AdminBrandsModule } from './admin/brands/admin-brands.module';
import { AdminCategoriesModule } from './admin/categories/admin-categories.module';
import { AdminCouponsModule } from './admin/coupons/admin-coupons.module';
import { AdminRolesModule } from './admin/roles/admin-roles.module';
import { AdminAdminUsersModule } from './admin/admin-users/admin-admin-users.module';
import { AdminSettingsModule } from './admin/settings/admin-settings.module';
import { AdminInventoryModule } from './admin/inventory/admin-inventory.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    ConsentsModule,
    PreferencesModule,
    ProductsModule,
    KitTemplatesModule,
    SubscriptionsModule,
    OrdersModule,
    RewardsModule,
    ReferralsModule,
    CycleModule,
    EducationModule,
    ReviewsModule,
    WishlistModule,
    SupportModule,
    AdminAuthModule,
    DashboardModule,
    AdminUsersModule,
    AdminOrdersModule,
    AdminProductsModule,
    AdminSubscriptionsModule,
    AdminReviewsModule,
    AdminEducationModule,
    AdminPoliciesModule,
    AdminConsentLogsModule,
    AdminAuditLogsModule,
    AdminRewardsModule,
    AdminSupportModule,
    AdminBrandsModule,
    AdminCategoriesModule,
    AdminCouponsModule,
    AdminRolesModule,
    AdminAdminUsersModule,
    AdminSettingsModule,
    AdminInventoryModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
