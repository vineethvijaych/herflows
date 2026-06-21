'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserRound, ShieldCheck } from 'lucide-react';
import {
  Section,
  EmptyState,
  Surface,
  PageHeader,
  Skeleton,
} from '@/components/experience/primitives';
import { useProfile, useUpdateProfile } from '@/lib/queries';
import { useToastStore } from '@/components/experience/toast';

export function ProfileExperience() {
  const toast = useToastStore((s) => s.addToast);
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? '');
      setEmail(profile.email ?? '');
      setPhone(profile.phone ?? '');
    }
  }, [profile]);

  const handleSave = () => {
    updateProfile.mutate(
      { name, email, phone },
      {
        onSuccess: () => toast('Profile saved'),
        onError: () => toast('Could not save profile'),
      },
    );
  };

  return (
    <>
      <PageHeader
        eyebrow="Profile"
        title="Your profile"
        copy="Your name, contact, and preferences in one place."
        icon={<UserRound className="h-6 w-6" />}
      />
      <Section narrow>
        {isLoading ? (
          <Skeleton className="h-64 rounded-3xl" />
        ) : (
          <>
            <Surface>
              <div className="space-y-5">
                <div>
                  <label
                    className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400"
                    htmlFor="profile-name"
                  >
                    Your name
                  </label>
                  <input
                    id="profile-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/80 bg-white/72 px-4 py-3 font-semibold text-stone-950 shadow-inner outline-none focus:ring-2 focus:ring-rose-300"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label
                    className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400"
                    htmlFor="profile-email"
                  >
                    Email
                  </label>
                  <input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/80 bg-white/72 px-4 py-3 font-semibold text-stone-950 shadow-inner outline-none focus:ring-2 focus:ring-rose-300"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label
                    className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400"
                    htmlFor="profile-phone"
                  >
                    Phone
                  </label>
                  <input
                    id="profile-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/80 bg-white/72 px-4 py-3 font-semibold text-stone-950 shadow-inner outline-none focus:ring-2 focus:ring-rose-300"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSave}
                  disabled={updateProfile.isPending}
                  className="w-full rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {updateProfile.isPending ? 'Saving...' : 'Save changes'}
                </motion.button>
              </div>
            </Surface>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Link href="/settings">
                <Surface>
                  <ShieldCheck className="mb-4 h-5 w-5 text-emerald-600" />
                  <h3 className="text-xl font-semibold text-stone-950">Addresses</h3>
                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    Manage your delivery addresses.
                  </p>
                </Surface>
              </Link>
              <Link href="/settings">
                <Surface>
                  <ShieldCheck className="mb-4 h-5 w-5 text-emerald-600" />
                  <h3 className="text-xl font-semibold text-stone-950">Notifications</h3>
                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    Choose what updates you get.
                  </p>
                </Surface>
              </Link>
            </div>
          </>
        )}
      </Section>
    </>
  );
}
