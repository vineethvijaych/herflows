"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const roles = [
        { name: 'Super Admin', modules: ['all'] },
        { name: 'Operations Manager', modules: ['orders', 'products', 'inventory', 'shipping'] },
        { name: 'Inventory Manager', modules: ['inventory', 'products'] },
        { name: 'Customer Support', modules: ['support_tickets', 'orders'] },
        { name: 'Content Manager', modules: ['education', 'policies'] },
        { name: 'Marketing Manager', modules: ['rewards', 'coupons', 'referrals'] },
        { name: 'Finance', modules: ['orders', 'payments', 'rewards'] },
    ];
    const actions = ['read', 'create', 'update', 'delete'];
    for (const roleData of roles) {
        const role = await prisma.role.upsert({
            where: { name: roleData.name },
            update: {},
            create: { name: roleData.name },
        });
        if (roleData.name === 'Super Admin') {
            const allModules = [
                'dashboard', 'orders', 'products', 'categories', 'brands', 'inventory',
                'users', 'subscriptions', 'reviews', 'education', 'policies',
                'consent_logs', 'audit_logs', 'rewards', 'coupons', 'support_tickets',
                'settings', 'roles', 'admin_users', 'shipping', 'payments', 'analytics',
            ];
            for (const mod of allModules) {
                for (const action of actions) {
                    await prisma.permission.upsert({
                        where: { roleId_module_action: { roleId: role.id, module: mod, action } },
                        update: {},
                        create: { roleId: role.id, module: mod, action },
                    });
                }
            }
        }
        else {
            for (const mod of roleData.modules) {
                for (const action of actions) {
                    await prisma.permission.upsert({
                        where: { roleId_module_action: { roleId: role.id, module: mod, action } },
                        update: {},
                        create: { roleId: role.id, module: mod, action },
                    });
                }
            }
        }
    }
    const adminPassword = await bcrypt.hash('admin123', 12);
    const superAdminRole = await prisma.role.findUnique({ where: { name: 'Super Admin' } });
    const opsRole = await prisma.role.findUnique({ where: { name: 'Operations Manager' } });
    await prisma.adminUser.upsert({
        where: { email: 'superadmin@herflows.com' },
        update: {},
        create: {
            name: 'Super Admin',
            email: 'superadmin@herflows.com',
            passwordHash: adminPassword,
            roleId: superAdminRole.id,
        },
    });
    await prisma.adminUser.upsert({
        where: { email: 'ops@herflows.com' },
        update: {},
        create: {
            name: 'Operations Manager',
            email: 'ops@herflows.com',
            passwordHash: adminPassword,
            roleId: opsRole.id,
        },
    });
    const padCategory = await prisma.category.upsert({
        where: { id: 'cat-pads' },
        update: {},
        create: { id: 'cat-pads', name: 'Sanitary Pads' },
    });
    const cupCategory = await prisma.category.upsert({
        where: { id: 'cat-cups' },
        update: {},
        create: { id: 'cat-cups', name: 'Menstrual Cups' },
    });
    const brand = await prisma.brand.upsert({
        where: { name: 'HerFlows Essentials' },
        update: {},
        create: { name: 'HerFlows Essentials', description: 'Our premium line of period care products' },
    });
    const product1 = await prisma.product.upsert({
        where: { id: 'prod-1' },
        update: {},
        create: {
            id: 'prod-1',
            brandId: brand.id,
            categoryId: padCategory.id,
            name: 'Organic Cotton Pads - Regular',
            description: 'Soft, breathable organic cotton pads with wings. Hypoallergenic and chlorine-free.',
            materials: ['Organic Cotton', 'SAP', 'Breathable Film'],
            status: 'active',
        },
    });
    await prisma.productVariant.upsert({
        where: { sku: 'OCP-REG-10' },
        update: {},
        create: {
            productId: product1.id,
            sku: 'OCP-REG-10',
            attributes: { size: 'Regular', packSize: '10' },
            price: 149,
            stockQty: 500,
        },
    });
    await prisma.productVariant.upsert({
        where: { sku: 'OCP-REG-20' },
        update: {},
        create: {
            productId: product1.id,
            sku: 'OCP-REG-20',
            attributes: { size: 'Regular', packSize: '20' },
            price: 279,
            stockQty: 300,
        },
    });
    const product2 = await prisma.product.upsert({
        where: { id: 'prod-2' },
        update: {},
        create: {
            id: 'prod-2',
            brandId: brand.id,
            categoryId: cupCategory.id,
            name: 'Silicone Menstrual Cup - Small',
            description: 'Medical-grade silicone menstrual cup. Reusable for up to 10 years.',
            materials: ['Medical-grade Silicone'],
            status: 'active',
        },
    });
    await prisma.productVariant.upsert({
        where: { sku: 'SMC-SMALL' },
        update: {},
        create: {
            productId: product2.id,
            sku: 'SMC-SMALL',
            attributes: { size: 'Small', color: 'Clear' },
            price: 799,
            stockQty: 200,
        },
    });
    const policyTypes = [
        'privacy_policy', 'terms_and_conditions', 'medical_disclaimer',
        'consent_policy', 'data_processing', 'cookie_policy', 'marketing_emails',
    ];
    for (const type of policyTypes) {
        await prisma.policyDocument.upsert({
            where: { type_version: { type, version: 1 } },
            update: {},
            create: {
                type,
                version: 1,
                content: `This is the ${type.replace(/_/g, ' ')} for HerFlows. By using our platform, you agree to the terms outlined in this document. This is version 1 of this policy.`,
                publishedAt: new Date('2024-01-01'),
            },
        });
    }
    console.log('Seed completed successfully');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map