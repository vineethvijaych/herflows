'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LifeBuoy, Send, ArrowRight } from 'lucide-react';
import {
  Section,
  EmptyState,
  Surface,
  PageHeader,
  Skeleton,
} from '@/components/experience/primitives';
import { useTickets } from '@/lib/queries';
import { api } from '@/lib/api';
import { useToastStore } from '@/components/experience/toast';

export function SupportExperience({ compose = false }: { compose?: boolean }) {
  const toast = useToastStore((s) => s.addToast);
  const tickets = useTickets();

  return (
    <>
      <PageHeader
        eyebrow="Support"
        title={compose ? 'Send us a message' : 'Get help when you need it'}
        copy="Ask about delivery, your kit, or anything else."
        icon={<LifeBuoy className="h-6 w-6" />}
      />
      <Section>
        {compose ? (
          <SupportForm
            onSent={() => {
              toast('Message sent');
              void tickets.refetch();
            }}
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            <Surface>
              <h3 className="text-xl font-semibold">Message support</h3>
              <p className="mt-3 text-stone-600">
                Ask about delivery, your plan, or your kit.
              </p>
              <Link
                href="/support/new"
                className="mt-5 inline-flex items-center font-semibold text-rose-600"
              >
                Send message <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              {tickets.isLoading ? (
                <div className="mt-6">
                  <Skeleton className="h-12 rounded-2xl" count={2} />
                </div>
              ) : tickets.data && tickets.data.length > 0 ? (
                <div className="mt-6 space-y-2 border-t border-white/60 pt-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
                    Recent tickets
                  </p>
                  {tickets.data.slice(0, 3).map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between rounded-2xl bg-white/50 p-3 text-sm"
                    >
                      <span className="font-medium text-stone-800">{t.subject}</span>
                      <span className="text-xs font-semibold text-stone-500">{t.status}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </Surface>
            <Surface>
              <h3 className="text-xl font-semibold">Privacy</h3>
              <p className="mt-3 text-stone-600">
                Your data is yours. See what we store and why.
              </p>
            </Surface>
          </div>
        )}
      </Section>
    </>
  );
}

function SupportForm({ onSent }: { onSent: () => void }) {
  const schema = z.object({
    subject: z.string().min(3, 'Subject must be at least 3 characters'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
  });
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  const [error, setError] = useState('');

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      await api.post('/support/tickets', values);
      onSent();
    } catch {
      setError('Could not send message. Try again.');
    }
  };

  return (
    <Surface className="mx-auto max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
            Subject
          </span>
          <input
            {...register('subject')}
            className="mt-2 w-full rounded-2xl border border-white/80 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-300"
            placeholder="What is this about?"
          />
        </label>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
            Message
          </span>
          <textarea
            {...register('message')}
            rows={6}
            className="mt-2 w-full rounded-2xl border border-white/80 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-300"
            placeholder="How can we help?"
          />
        </label>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Send message'}
          <Send className="h-4 w-4" />
        </motion.button>
      </form>
    </Surface>
  );
}
