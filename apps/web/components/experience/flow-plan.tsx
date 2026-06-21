'use client';

import { motion } from 'framer-motion';
import { Heart, Pause, Play, SkipForward, RefreshCw, Check } from 'lucide-react';
import {
  Section,
  EmptyState,
  Surface,
  PageHeader,
  Skeleton,
} from '@/components/experience/primitives';
import { useSubscriptions, useUpdateSubscription } from '@/lib/queries';
import { formatShortDate, cn } from '@/lib/utils';
import { useToastStore } from '@/components/experience/toast';

export function FlowPlanExperience() {
  const subscriptions = useSubscriptions();
  const updateSub = useUpdateSubscription();
  const toast = useToastStore((s) => s.addToast);
  const plan = subscriptions.data?.[0];

  const act = (action: 'pause' | 'resume' | 'skip' | 'renew') => {
    if (!plan?.id) return;
    updateSub.mutate(
      { id: plan.id, action },
      {
        onSuccess: () => toast(`Plan ${action === 'renew' ? 'renewed' : action + 'd'}`),
        onError: () => toast('Could not update plan'),
      },
    );
  };

  return (
    <>
      <PageHeader
        eyebrow="My Plan"
        title="Manage your flow plan"
        copy="Pause, skip, or renew your plan whenever you need to."
        icon={<Heart className="h-6 w-6" />}
      />
      <Section>
        {subscriptions.isLoading ? (
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <Skeleton className="h-56 rounded-3xl" />
            <Skeleton className="h-56 rounded-3xl" />
          </div>
        ) : plan ? (
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <Surface>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">
                Current plan
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-stone-950">
                {plan.planType ?? 'Wellness plan'}
              </h2>
              <p className="mt-3 leading-7 text-stone-600">
                Status: {plan.status ?? 'active'}. Next shipment:{' '}
                {formatShortDate(plan.nextShipmentDate ?? plan.nextBillingDate)}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <PlanButton icon={Pause} label="Pause" onPress={() => act('pause')} />
                <PlanButton icon={Play} label="Resume" onPress={() => act('resume')} />
                <PlanButton icon={SkipForward} label="Skip" onPress={() => act('skip')} />
                <PlanButton icon={RefreshCw} label="Renew" onPress={() => act('renew')} />
              </div>
            </Surface>
            <Surface>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                Edit window
              </p>
              <div className="mt-5 rounded-[1.35rem] bg-stone-950 p-5 text-white">
                <p className="text-5xl font-semibold">6 days</p>
                <p className="mt-2 text-sm text-white/70">to change next month before it ships</p>
              </div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-5 space-y-3"
              >
                {[
                  'Review current kit',
                  'Confirm delivery address',
                  'Use available rewards',
                ].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.07 }}
                    className="flex items-center gap-3 rounded-2xl bg-white/60 p-3"
                  >
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-stone-700">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </Surface>
          </div>
        ) : (
          <Surface>
            <EmptyState
              title="No active plan"
              copy="Build a kit first, then choose how often you want it delivered."
            />
          </Surface>
        )}
      </Section>
    </>
  );
}

function PlanButton({
  icon: Icon,
  label,
  onPress,
}: {
  icon: typeof Pause;
  label: string;
  onPress: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onPress}
      className="flex flex-col items-center gap-2 rounded-[1.2rem] bg-white/62 p-4 text-sm font-semibold text-stone-700"
    >
      <Icon className="h-5 w-5" />
      {label}
    </motion.button>
  );
}
