'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ShoppingCart, Package, Tags, Users, RefreshCw,
  Star, BookOpen, FileText, Shield, ScrollText, Gift, Percent,
  LifeBuoy, Settings, UserCog, Truck, BarChart3, Menu, X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/categories', label: 'Categories', icon: Tags },
  { href: '/brands', label: 'Brands', icon: Tags },
  { href: '/inventory', label: 'Inventory', icon: Package },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/subscriptions', label: 'Subscriptions', icon: RefreshCw },
  { href: '/reviews', label: 'Reviews', icon: Star },
  { href: '/education', label: 'Education', icon: BookOpen },
  { href: '/policies', label: 'Policies', icon: FileText },
  { href: '/consent-logs', label: 'Consent Logs', icon: Shield },
  { href: '/audit-logs', label: 'Audit Logs', icon: ScrollText },
  { href: '/rewards', label: 'Rewards', icon: Gift },
  { href: '/coupons', label: 'Coupons', icon: Percent },
  { href: '/support', label: 'Support', icon: LifeBuoy },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/roles', label: 'Roles', icon: UserCog },
  { href: '/admin-users', label: 'Admin Users', icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-admin-sidebar text-white p-2 rounded-lg"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside className={`${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-admin-sidebar text-white flex flex-col transition-transform duration-200`}>
        <div className="p-4 border-b border-gray-700">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-lg font-bold">HerFlows</span>
            <span className="text-xs bg-admin-accent px-2 py-0.5 rounded">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map(item => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-admin-accent text-white'
                    : 'text-gray-400 hover:bg-admin-sidebar-hover hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
