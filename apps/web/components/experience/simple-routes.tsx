'use client';

import { motion } from 'framer-motion';
import { Heart, Send, Gift } from 'lucide-react';
import {
  Section,
  EmptyState,
  Surface,
  PageHeader,
  Skeleton,
} from '@/components/experience/primitives';
import { useWishlist, useReferralCode, useReferralStatus } from '@/lib/queries';

export function SimpleRouteExperience({
  kind,
}: {
  kind: 'wishlist' | 'referrals';
}) {
  const wishlist = kind === 'wishlist' ? useWishlist() : null;
  const referralCode = kind === 'referrals' ? useReferralCode() : null;
  const referralStatus = kind === 'referrals' ? useReferralStatus() : null;

  if (kind === 'wishlist') {
    return (
      <>
        <PageHeader
          eyebrow="Saved"
          title="Products you might come back to"
          copy="Items you saved stay here until you are ready to add them to your kit."
          icon={<Heart className="h-6 w-6" />}
        />
        <Section>
          {wishlist?.isLoading ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-32 rounded-3xl" count={3} />
            </div>
          ) : wishlist?.data && wishlist.data.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {wishlist.data.map(
                (entry: {
                  id: string;
                  variant: {
                    id: string;
                    product: { id: string; name: string; description?: string };
                  };
                }) => (
                  <Surface key={entry.id}>
                    <h3 className="font-semibold text-stone-950">
                      {entry.variant.product.name}
                    </h3>
                    <p className="mt-2 text-sm text-stone-500">
                      {entry.variant.product.description ?? 'Saved item'}
                    </p>
                  </Surface>
                ),
              )}
            </div>
          ) : (
            <Surface>
              <EmptyState
                title="Nothing saved yet"
                copy="When you save products they will show up here."
              />
            </Surface>
          )}
        </Section>
      </>
    );
  }

  if (kind === 'referrals') {
    return (
      <>
        <PageHeader
          eyebrow="Referrals"
          title="Share with someone you care about"
          copy="See your referral progress and share your code."
          icon={<Send className="h-6 w-6" />}
        />
        <Section>
          {referralCode?.isLoading ? (
            <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
              <Skeleton className="h-40 rounded-3xl" />
              <Skeleton className="h-40 rounded-3xl" />
            </div>
          ) : referralCode?.data ? (
            <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
              <Surface>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">
                  Your code
                </p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
                  {referralCode.data.code}
                </p>
                <p className="mt-3 text-sm text-stone-500">
                  Share this code with friends to earn rewards.
                </p>
              </Surface>
              {referralStatus?.data && (
                <Surface>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                    Stats
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-2xl font-semibold">{referralStatus.data.total}</p>
                      <p className="text-xs text-stone-500">Total</p>
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{referralStatus.data.rewarded}</p>
                      <p className="text-xs text-stone-500">Rewarded</p>
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{referralStatus.data.pending}</p>
                      <p className="text-xs text-stone-500">Pending</p>
                    </div>
                  </div>
                </Surface>
              )}
            </div>
          ) : (
            <Surface>
              <EmptyState
                title="No referral activity yet"
                copy="Share your referral code to start earning rewards."
              />
            </Surface>
          )}
        </Section>
      </>
    );
  }

  return null;
}
