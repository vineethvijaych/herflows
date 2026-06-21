'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Copy,
  Gift,
  Heart,
  HeartPulse,
  PackageCheck,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Sparkles,
  Star,
  Target,
  Timer,
  Truck,
  UserRound,
  Wand2,
} from 'lucide-react';
import {
  useProfile,
  useCycleEntries,
  useCycleEstimate,
  useOrders,
  useSubscriptions,
  useArticles,
  useRewards,
  useReferralCode,
  useReferralStatus,
  useUpdateSubscription,
} from '@/lib/queries';
import { useHerFlowsStore } from '@/lib/store';
import { daysBetween, formatShortDate, cn } from '@/lib/utils';
import { Section, EmptyState, Metric, Button, Skeleton, ActionCard, Badge, Surface } from './primitives';
import { useToastStore } from './toast';
import { RouteAction } from './shell';

const ease = [0.16, 1, 0.3, 1];
const circumference = 2 * Math.PI * 54;

function useClientNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function greeting(now: Date | null, name?: string) {
  const first = name?.split(' ')[0];
  if (!now) return first ? `Hello, ${first}` : 'Hello';
  const hour = now.getHours();
  const prefix = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return first ? `${prefix}, ${first}` : prefix;
}

function cap(value?: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function tagline(cycleDate?: string, daysToCycle?: number | null) {
  if (daysToCycle === null || daysToCycle === undefined) return 'Your daily space for cycle tracking and self-care.';
  if (daysToCycle <= 2) return 'Your cycle may be approaching. Take it easy.';
  if (daysToCycle <= 7) return 'Nurturing yourself is always in season.';
  return 'Listen to your body — it knows the way.';
}

const fadeProps = (shouldReduce: boolean, y = 16) => ({
  initial: { opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : y },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5, ease },
});

export function DashboardExperience() {
  const shouldReduceMotion = useReducedMotion();
  const now = useClientNow();
  const toast = useToastStore((s) => s.addToast);

  const profile = useProfile();
  const entries = useCycleEntries();
  const estimate = useCycleEstimate();
  const orders = useOrders();
  const subscriptions = useSubscriptions();
  const articles = useArticles();
  const rewards = useRewards();
  const referralCode = useReferralCode();
  const referralStatus = useReferralStatus();
  const updateSub = useUpdateSubscription();

  const cycleDate = estimate.data?.estimatedStartDate ?? estimate.data?.nextPeriodDate;
  const daysToCycle = cycleDate && now ? Math.max(0, daysBetween(now, new Date(cycleDate))) : null;
  const activePlan = subscriptions.data?.find((plan) => plan.status === 'active' || plan.status === 'paused');
  const recentOrder = orders.data?.[0];
  const featuredArticle = articles.data?.[0];
  const points = rewards.data?.points ?? rewards.data?.balance ?? profile.data?.rewardPoints ?? 0;

  const estimateHeadline =
    daysToCycle === null
      ? 'Add a few entries to see this'
      : daysToCycle === 0
        ? 'Expected around today'
        : `In about ${daysToCycle} day${daysToCycle === 1 ? '' : 's'}`;

  const progress = daysToCycle === null ? 0.32 : Math.max(0.08, Math.min(0.92, 1 - daysToCycle / 28));
  const rewardProgress = Math.min(1, points / 500);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => toast('Code copied')).catch(() => {});
  };

  const act = (action: 'pause' | 'resume' | 'renew') => {
    if (!activePlan?.id) return;
    updateSub.mutate({ id: activePlan.id, action }, {
      onSuccess: () => toast(`Plan ${action}d`),
      onError: () => toast('Could not update plan'),
    });
  };

  const recentActivity = [
    ...(entries.data ?? []).slice(0, 2).map((e) => ({ id: e.id ?? e.date, type: 'cycle' as const, label: 'Cycle entry', detail: `${formatShortDate(e.date)} · ${e.mood ?? 'logged'}`, date: e.date })),
    ...(orders.data ?? []).slice(0, 1).map((o) => ({ id: o.id, type: 'order' as const, label: 'Order update', detail: `${o.status ?? 'Processing'}`, date: o.placedAt ?? '' })),
    ...(articles.data ?? []).slice(0, 1).map((a) => ({ id: a.id ?? a.slug ?? a.title, type: 'article' as const, label: 'Article read', detail: a.title, date: a.publishedAt ?? '' })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);

  const orderStatusIndex = recentOrder
    ? ['preparing', 'packed', 'shipped', 'delivered'].findIndex((s) => (recentOrder.status ?? '').toLowerCase().includes(s)) + 1
    : 0;

  const m = (y = 16) => ({
    hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : y },
    visible: { opacity: 1, y: 0 },
  });

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-4 pt-20 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                {greeting(now, profile.data?.name)}
              </h1>
              <p className="mt-2 text-base text-stone-500">
                {now?.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              <p className="mt-2 max-w-lg text-lg leading-7 text-stone-600">
                {tagline(cycleDate, daysToCycle)}
              </p>
            </div>
            <Link
              href="/cycle-tracker"
              className="mt-4 inline-flex items-center gap-2 self-start rounded-full bg-white/70 px-5 py-2.5 text-sm font-semibold text-stone-700 shadow-card backdrop-blur-2xl transition hover:bg-white sm:mt-0"
            >
              <Plus className="h-4 w-4" />
              Log today
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          <Surface delay={0} className="lg:col-span-2 relative overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(251,113,133,0.32),transparent_70%)]"
            />
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-rose-500">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    Next cycle estimate
                  </p>
                  <p className="mt-4 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">{estimateHeadline}</p>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-stone-500">
                    {cycleDate
                      ? `Estimated start around ${formatShortDate(cycleDate)}. `
                      : 'Log a few cycles and we will estimate your next one. '}
                    Based only on what you log here — never a diagnosis.
                  </p>
                  <Link
                    href="/cycle-tracker"
                    className="mt-6 inline-flex items-center text-sm font-semibold text-rose-600 transition hover:text-rose-700"
                  >
                    Go to cycle tracker <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </div>
                <div className="hidden shrink-0 sm:block">
                  <svg width="130" height="130" viewBox="0 0 130 130" className="-rotate-90" aria-hidden="true">
                    <circle cx="65" cy="65" r="54" fill="none" stroke="rgba(87,67,54,0.08)" strokeWidth="10" />
                    <motion.circle
                      cx="65" cy="65" r="54"
                      fill="none"
                      stroke="url(#cycleDash)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: circumference * (1 - progress) }}
                      transition={{ duration: shouldReduceMotion ? 0 : 1.2, ease }}
                    />
                    <defs>
                      <linearGradient id="cycleDash" x1="0" x2="1" y1="0" y2="1">
                        <stop stopColor="#fb7185" />
                        <stop offset="0.5" stopColor="#f59e0b" />
                        <stop offset="1" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <p className="mt-5 text-xs leading-5 text-stone-400">
                <span className="font-semibold">Disclaimer:</span> This is an estimate based on your logged entries, not medical advice.
              </p>
            </div>
          </Surface>

          <Surface delay={0.04}>
            {subscriptions.isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-24 rounded-full" />
                <Skeleton className="h-8 w-36 rounded-lg" />
                <Skeleton className="h-4 w-48 rounded-full" />
              </div>
            ) : (
              <>
                <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                  <HeartPulse className="h-3.5 w-3.5" aria-hidden="true" />
                  Flow plan
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                    {activePlan?.planType ?? 'No plan'}
                  </h2>
                  <Badge variant={activePlan?.status === 'active' ? 'sage' : activePlan?.status === 'paused' ? 'amber' : 'stone'}>
                    {activePlan?.status ?? 'none'}
                  </Badge>
                </div>
                {activePlan ? (
                  <>
                    <p className="mt-3 text-sm leading-6 text-stone-600">
                      Next shipment: {formatShortDate(activePlan.nextShipmentDate ?? activePlan.renewalDate)}
                    </p>
                    <div className="mt-5 flex gap-2">
                      {activePlan.status === 'active' && (
                        <button
                          onClick={() => act('pause')}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.1em] text-stone-700 shadow-sm transition hover:bg-white"
                        >
                          <Pause className="h-3.5 w-3.5" /> Pause
                        </button>
                      )}
                      {activePlan.status === 'paused' && (
                        <button
                          onClick={() => act('resume')}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.1em] text-stone-700 shadow-sm transition hover:bg-white"
                        >
                          <Play className="h-3.5 w-3.5" /> Resume
                        </button>
                      )}
                      <button
                        onClick={() => act('renew')}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.1em] text-stone-700 shadow-sm transition hover:bg-white"
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> Renew
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    Build a kit and pick a plan that fits your rhythm.
                  </p>
                )}
                <Link
                  href="/subscription"
                  className="mt-5 inline-flex items-center text-sm font-semibold text-rose-600 transition hover:text-rose-700"
                >
                  Manage plan <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </>
            )}
          </Surface>
        </div>
      </section>

      <Section eyebrow="Quick actions" title="What would you like to do?" narrow>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.05 } } }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <ActionCard
            href="/cycle-tracker"
            icon={<CalendarDays className="h-5 w-5" />}
            title="Log today"
            copy="Track your cycle, mood, and symptoms."
          />
          <ActionCard
            href="/kit-builder"
            icon={<Wand2 className="h-5 w-5" />}
            title="Build my kit"
            copy="Curate your monthly wellness kit."
          />
          <ActionCard
            href="/subscription"
            icon={<HeartPulse className="h-5 w-5" />}
            title="View my plan"
            copy="Check your flow plan and shipments."
          />
          <ActionCard
            href="/education"
            icon={<BookOpen className="h-5 w-5" />}
            title="Learn something"
            copy="Read articles about your body and cycle."
          />
        </motion.div>
      </Section>

      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          <Surface delay={0.08} className="lg:col-span-2">
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
              <Truck className="h-3.5 w-3.5" aria-hidden="true" />
              Upcoming shipment
            </p>
            {orders.isLoading ? (
              <div className="mt-4 space-y-4">
                <Skeleton className="h-6 w-44 rounded-lg" />
                <Skeleton className="h-4 w-64 rounded-full" />
                <Skeleton className="h-20 w-full rounded-2xl" />
              </div>
            ) : recentOrder ? (
              <>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
                  {cap(recentOrder.status) ?? 'Processing'}
                </h2>
                {recentOrder.estimatedDelivery && (
                  <p className="mt-1 text-sm text-stone-500">
                    Est. delivery: {formatShortDate(recentOrder.estimatedDelivery)}
                  </p>
                )}
                <div className="mt-6 flex items-center gap-2">
                  {['Preparing', 'Packed', 'Shipped', 'Delivered'].map((step, index) => {
                    const active = index <= orderStatusIndex;
                    return (
                      <div key={step} className="flex flex-1 flex-col items-center gap-2">
                        <span
                          className={cn(
                            'grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors duration-300',
                            active ? 'bg-stone-950 text-white' : 'bg-stone-100 text-stone-400',
                          )}
                        >
                          {active && orderStatusIndex > index ? '\u2713' : index + 1}
                        </span>
                        <span className={cn('text-[0.65rem] font-semibold uppercase tracking-[0.1em]', active ? 'text-stone-700' : 'text-stone-400')}>
                          {step}
                        </span>
                        {index < 3 && (
                          <div className={cn('hidden h-0.5 w-full self-center sm:block', active ? 'bg-stone-950' : 'bg-stone-200')} />
                        )}
                      </div>
                    );
                  })}
                </div>
                {recentOrder.trackingNumber && (
                  <p className="mt-5 text-sm text-stone-500">
                    Tracking: <span className="font-semibold text-stone-700">{recentOrder.trackingNumber}</span>
                  </p>
                )}
                <Link
                  href={`/orders`}
                  className="mt-4 inline-flex items-center text-sm font-semibold text-rose-600 transition hover:text-rose-700"
                >
                  View details <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </>
            ) : (
              <div className="mt-4">
                <EmptyState title="No shipments yet" copy="When you place an order, you will see its progress here." />
              </div>
            )}
          </Surface>

          <Surface delay={0.12}>
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
              <Gift className="h-3.5 w-3.5" aria-hidden="true" />
              Rewards
            </p>
            {rewards.isLoading ? (
              <div className="mt-4 space-y-4">
                <Skeleton className="h-10 w-24 rounded-lg" />
                <Skeleton className="h-3 w-full rounded-full" />
              </div>
            ) : (
              <>
                <p className="mt-3 text-4xl font-semibold tracking-tight text-stone-950">{points}</p>
                <p className="text-sm font-medium text-stone-500">points</p>
                <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/70">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: rewardProgress }}
                    viewport={{ once: true }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease }}
                    className="h-full origin-left rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-emerald-500"
                  />
                </div>
                <p className="mt-3 text-xs leading-5 text-stone-500">
                  {500 - points} points until your next perk
                </p>
                <Link
                  href="/rewards"
                  className="mt-4 inline-flex items-center text-sm font-semibold text-rose-600 transition hover:text-rose-700"
                >
                  View rewards <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </>
            )}
          </Surface>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          <Surface delay={0.16} className="lg:col-span-2">
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
              <Activity className="h-3.5 w-3.5" aria-hidden="true" />
              Recent activity
            </p>
            {entries.isLoading || orders.isLoading || articles.isLoading ? (
              <div className="mt-4 space-y-3">
                <Skeleton className="h-16 w-full rounded-2xl" count={3} />
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="mt-4">
                <AnimatePresence mode="popLayout">
                  {recentActivity.map((item, i) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 12, scale: shouldReduceMotion ? 1 : 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      transition={{ duration: 0.35, delay: shouldReduceMotion ? 0 : i * 0.05, ease }}
                      className="mb-2 flex items-center gap-4 rounded-2xl bg-white/58 p-4 last:mb-0"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-stone-950/5 text-stone-700">
                        {item.type === 'cycle' ? <Heart className="h-4 w-4" /> : item.type === 'order' ? <PackageCheck className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{item.label}</p>
                        <p className="truncate text-sm font-semibold text-stone-800">{item.detail}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="mt-4">
                <EmptyState title="No activity yet" copy="Your logs, orders, and reading history will show here." />
              </div>
            )}
          </Surface>

          <Surface delay={0.2}>
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-lavender-700">
              <Star className="h-3.5 w-3.5" aria-hidden="true" />
              Referrals
            </p>
            {referralCode.isLoading ? (
              <div className="mt-4 space-y-3">
                <Skeleton className="h-6 w-32 rounded-lg" />
                <Skeleton className="h-4 w-24 rounded-full" />
              </div>
            ) : referralCode.data ? (
              <>
                <div className="mt-4 flex items-center gap-3">
                  <code className="rounded-xl bg-white/70 px-3.5 py-2 font-mono text-lg font-bold tracking-wider text-stone-950 shadow-sm">
                    {referralCode.data.code}
                  </code>
                  <button
                    onClick={() => handleCopyCode(referralCode.data.code)}
                    className="grid h-9 w-9 place-items-center rounded-full bg-stone-950 text-white transition hover:bg-stone-800 active:scale-90"
                    aria-label="Copy referral code"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                {referralStatus.data && (
                  <p className="mt-4 text-sm text-stone-600">
                    <span className="font-semibold text-stone-950">{referralStatus.data.total}</span> referral{referralStatus.data.total !== 1 ? 's' : ''}
                    {referralStatus.data.rewarded > 0 && (
                      <> &middot; <span className="font-semibold text-emerald-700">{referralStatus.data.rewarded} rewarded</span></>
                    )}
                  </p>
                )}
                <Link
                  href="/referrals"
                  className="mt-5 inline-flex items-center text-sm font-semibold text-rose-600 transition hover:text-rose-700"
                >
                  Share your code <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </>
            ) : (
              <div className="mt-4">
                <EmptyState title="Referrals are off" copy="Referral access will appear when available." />
              </div>
            )}
          </Surface>
        </div>
      </section>

      <Section eyebrow="Learn" title="A tip for today" narrow>
        {articles.isLoading ? (
          <div className="h-48 rounded-2xl bg-white/50 motion-safe:animate-pulse" />
        ) : featuredArticle ? (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="grid overflow-hidden rounded-2xl border border-white/70 bg-white/62 shadow-card backdrop-blur-2xl md:grid-cols-[0.7fr_1fr]"
          >
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.1 }}
              className="min-h-48 bg-[radial-gradient(circle_at_35%_30%,rgba(251,113,133,0.55),transparent_28%),radial-gradient(circle_at_70%_70%,rgba(16,185,129,0.34),transparent_30%),linear-gradient(135deg,#fff1f2,#f7fee7)]"
            />
            <div className="flex flex-col justify-center p-6 md:p-8">
              <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-rose-500">
                <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                {featuredArticle.category ?? 'Education'}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">{featuredArticle.title}</h3>
              <p className="mt-4 leading-7 text-stone-600">
                {featuredArticle.excerpt ?? 'Explore and learn more about your body and cycle.'}
              </p>
              <Link
                href={`/education/${featuredArticle.slug ?? ''}`}
                className="mt-6 inline-flex items-center text-sm font-semibold text-stone-950 transition hover:text-rose-600"
              >
                Read full article <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        ) : (
          <EmptyState
            title="The library is growing"
            copy="When articles are published, we will surface a helpful read here."
          />
        )}
      </Section>
    </>
  );
}
