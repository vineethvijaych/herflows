import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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
    } else {
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
      roleId: superAdminRole!.id,
    },
  });

  await prisma.adminUser.upsert({
    where: { email: 'ops@herflows.com' },
    update: {},
    create: {
      name: 'Operations Manager',
      email: 'ops@herflows.com',
      passwordHash: adminPassword,
      roleId: opsRole!.id,
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
  ] as const;

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

  const articles = [
    { slug: "understanding-menstrual-products", title: "Understanding Menstrual Products", excerpt: "A comprehensive guide to different types of menstrual products and how to choose what works for you.", content: "There are many types of menstrual products available today. Sanitary pads, tampons, menstrual cups, and period underwear each have their own benefits. The right choice depends on your flow, lifestyle, and comfort preferences...", category: "Product Guide", publishedAt: new Date("2024-01-15") },
    { slug: "building-a-self-care-routine", title: "Building a Self-Care Routine During Your Cycle", excerpt: "Learn how to support your body through each phase of your menstrual cycle with simple self-care practices.", content: "Your menstrual cycle has four phases: menstrual, follicular, ovulation, and luteal. Each phase brings different hormonal changes that can affect your energy, mood, and physical needs...", category: "Wellness", publishedAt: new Date("2024-02-20") },
    { slug: "sustainable-period-care", title: "Sustainable Period Care: Making Eco-Friendly Choices", excerpt: "Discover reusable and eco-friendly menstrual products that are better for you and the planet.", content: "Making sustainable choices for your period care doesn't mean compromising on comfort or protection. Reusable products like menstrual cups, cloth pads, and period underwear have come a long way...", category: "Sustainability", publishedAt: new Date("2024-03-10") },
  ];

  for (const article of articles) {
    await prisma.educationArticle.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    });
  }

  const coupons = [
    { code: "WELCOME20", discountPercent: 20, maxUses: 100, usedCount: 45, expiresAt: new Date("2025-12-31"), isActive: true },
    { code: "FREESHIP", discountAmount: 50, maxUses: 200, usedCount: 78, expiresAt: new Date("2025-12-31"), isActive: true },
    { code: "HERFLOWS10", discountPercent: 10, maxUses: 500, usedCount: 120, expiresAt: new Date("2025-06-30"), isActive: true },
  ];

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: coupon,
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
