'use client';

import { motion } from 'framer-motion';
import { Gift, Star, Sparkles } from 'lucide-react';
import {
  Section,
  EmptyState,
  Surface,
  Metric,
  PageHeader,
  Skeleton,
} from '@/components/experience/primitives';
import { useRewards } from '@/lib/queries';

const milestones = ['First kit saved', 'Three cycle logs', 'Referral started'];

export function RewardsExperience() {
  const rewards = useRewards();
  const points = rewards.data?.points ?? rewards.data?.balance ?? 0;

  return (
    <>
      <PageHeader
        eyebrow="Rewards"
        title="Your rewards"
        copy="Points, levels, and special perks in one place."
        icon={<Gift className="h-6 w-6" />}
      />
      <Section>
        {rewards.isLoading ? (
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <Skeleton className="h-48 rounded-3xl" />
            <Skeleton className="h-48 rounded-3xl" />
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <Surface>
              <Metric label="Your balance" value={`${points} pts`} tone="gold" />
              <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/70">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-500" />
              </div>
              <p className="mt-3 text-sm text-stone-500">
                Your level progress toward the next monthly perk.
              </p>
            </Surface>
            <Surface>
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
                Achievements
              </p>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-3"
              >
                {milestones.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.08 }}
                    className="flex items-center gap-3 rounded-2xl bg-white/60 p-4"
                  >
                    <Star className="h-5 w-5 text-amber-500" />
                    <span className="font-semibold text-stone-800">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </Surface>
          </div>
        )}
      </Section>
    </>
  );
}
