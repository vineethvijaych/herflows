'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Gift,
  HeartPulse,
  CalendarDays,
  LayoutDashboard,
  LifeBuoy,
  PackageCheck,
  Settings,
  Sparkles,
  UserRound,
  Wand2,
  LogOut,
  Menu,
  X,
  Compass,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToastContainer } from '@/components/experience/toast';
import { PageTransition } from '@/components/experience/page-transition';
import { useHerFlowsStore } from '@/lib/store';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const topRoutes = [
  { href: '/', label: 'Cycle', icon: CalendarDays },
  { href: '/products', label: 'Discover', icon: Compass },
  { href: '/kit-builder', label: 'My Kit', icon: Wand2 },
  { href: '/subscription', label: 'Flow Plan', icon: HeartPulse },
  { href: '/education', label: 'Learn', icon: BookOpen },
];

const mobileRoutes = [
  { href: '/', label: 'Cycle', icon: CalendarDays },
  { href: '/products', label: 'Shop', icon: Compass },
  { href: '/kit-builder', label: 'Kit', icon: Wand2 },
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/settings', label: 'Profile', icon: UserRound },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-gradient-to-b from-[#fffaf6] via-[#fbf7f1] to-[#f5f7f1] text-stone-950">
      <div className="fixed inset-0 -z-10 bg-grid opacity-[0.35]" />
      <TopNav />
      <main className="pb-36 pt-16 md:pb-10 md:pt-24">
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter />
      <BottomNav />
      <ToastContainer />
    </div>
  );
}

function TopNav() {
  const pathname = usePathname();
  const isAuthenticated = useHerFlowsStore((s) => s.isAuthenticated);
  const logout = useHerFlowsStore((s) => s.logout);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/50 bg-[#fffaf6]/82 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href={isAuthenticated ? '/dashboard' : '/'} className="group flex items-center gap-3" aria-label="HerFlows home">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/70 bg-white/65 shadow-soft transition-transform duration-300 group-hover:scale-105 group-hover:shadow-elevated">
            <Sparkles className="h-5 w-5 text-coral-500" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-stone-950">HerFlows</span>
        </Link>

        {isAuthenticated && (
          <>
            <nav className="hidden items-center rounded-full border border-white/60 bg-white/50 p-1 shadow-nav md:flex" aria-label="Primary navigation">
              {topRoutes.map((route) => {
                const active = pathname === route.href || (route.href !== '/' && pathname.startsWith(route.href));
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      'inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-all duration-200',
                      active
                        ? 'bg-stone-950 text-white shadow-[0_10px_28px_rgba(28,25,23,0.16)]'
                        : 'text-stone-500 hover:bg-white/75 hover:text-stone-900',
                    )}
                  >
                    <route.icon className="h-4 w-4" aria-hidden="true" />
                    <span>{route.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="hidden items-center gap-1 md:flex">
              <Link
                href="/support"
                className="rounded-full p-3 text-stone-500 transition-all duration-200 hover:bg-white/70 hover:text-stone-950"
                aria-label="Support"
              >
                <LifeBuoy className="h-4 w-4" />
              </Link>
              <Link
                href="/rewards"
                className="rounded-full p-3 text-stone-500 transition-all duration-200 hover:bg-white/70 hover:text-stone-950"
                aria-label="Rewards"
              >
                <Gift className="h-4 w-4" />
              </Link>
              <Link
                href="/settings"
                className="rounded-full p-3 text-stone-500 transition-all duration-200 hover:bg-white/70 hover:text-stone-950"
                aria-label="Settings"
              >
                <UserRound className="h-4 w-4" />
              </Link>
              <button
                onClick={logout}
                className="rounded-full p-3 text-stone-400 transition-all duration-200 hover:bg-white/70 hover:text-coral-600"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center rounded-full p-2 text-stone-600 md:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </>
        )}

        {!isAuthenticated && (
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-ghost">
              Sign in
            </Link>
            <Link href="/auth/register" className="btn-primary">
              Get started
            </Link>
          </div>
        )}
      </div>

      <AnimatePresence>
        {menuOpen && isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-white/40 bg-white/80 backdrop-blur-2xl md:hidden"
          >
            <nav className="space-y-1 px-4 py-4">
              {topRoutes.map((route) => {
                const active = pathname === route.href || (route.href !== '/' && pathname.startsWith(route.href));
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors',
                      active ? 'bg-stone-950 text-white' : 'text-stone-600 hover:bg-white/60',
                    )}
                  >
                    <route.icon className="h-4 w-4" />
                    {route.label}
                  </Link>
                );
              })}
              <hr className="my-2 border-white/40" />
              <Link href="/support" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-stone-600 hover:bg-white/60">
                <LifeBuoy className="h-4 w-4" /> Support
              </Link>
              <Link href="/rewards" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-stone-600 hover:bg-white/60">
                <Gift className="h-4 w-4" /> Rewards
              </Link>
              <Link href="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-stone-600 hover:bg-white/60">
                <UserRound className="h-4 w-4" /> Profile
              </Link>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-coral-600 hover:bg-white/60">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function BottomNav() {
  const pathname = usePathname();
  const isAuthenticated = useHerFlowsStore((s) => s.isAuthenticated);

  if (!isAuthenticated) return null;

  return (
    <nav className="fixed inset-x-2 bottom-2 z-50 md:hidden" aria-label="Primary navigation">
      <div className="flex items-stretch gap-0.5 rounded-[2rem] border border-rose-200/60 bg-rose-50/90 p-1.5 shadow-lg backdrop-blur-2xl overflow-x-auto scrollbar-hide">
        {mobileRoutes.map((route) => {
          const active = pathname === route.href || (route.href !== '/' && pathname.startsWith(route.href));
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'flex min-h-14 flex-1 shrink-0 basis-0 flex-col items-center justify-center gap-0.5 rounded-[1.3rem] px-1.5 text-[0.62rem] font-semibold transition-all duration-200',
                active
                  ? 'bg-stone-950 text-white shadow-lg'
                  : 'text-stone-600 hover:bg-rose-100/70 hover:text-stone-950',
              )}
            >
              <route.icon className="h-5 w-5" aria-hidden="true" />
              <span className="leading-tight">{route.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function SiteFooter() {
  return (
    <footer className="hidden border-t border-white/50 bg-white/30 py-8 md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 text-sm text-stone-500">
        <p>Cycle info is estimated from your entries. Not medical advice.</p>
        <div className="flex items-center gap-6">
          <Link href="/support" className="transition-colors hover:text-stone-950">
            Support
          </Link>
          <Link href="/settings" className="transition-colors hover:text-stone-950">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function RouteAction({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="btn-primary inline-flex">
      {children}
    </Link>
  );
}
