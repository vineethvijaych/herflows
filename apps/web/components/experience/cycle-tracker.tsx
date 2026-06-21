'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Trash2, Calendar, Droplets, Activity } from 'lucide-react';
import {
  Section,
  EmptyState,
  Surface,
  PageHeader,
  Skeleton,
} from '@/components/experience/primitives';
import { useCycleEntries, useCreateCycleEntry, useDeleteCycleEntry } from '@/lib/queries';
import { formatShortDate, cn } from '@/lib/utils';
import { useToastStore } from '@/components/experience/toast';

const flowLevels = [
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'heavy', label: 'Heavy' },
];

const moods = ['steady', 'tender', 'energized', 'tired', 'crampy'];

export function CycleTrackerExperience() {
  const entries = useCycleEntries();
  const createEntry = useCreateCycleEntry();
  const deleteEntry = useDeleteCycleEntry();
  const toast = useToastStore((s) => s.addToast);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [flowLevel, setFlowLevel] = useState('light');
  const [mood, setMood] = useState('steady');

  const submitPeriod = () => {
    if (!date) { toast('Please select a date'); return; }
    createEntry.mutate(
      { date: new Date(date).toISOString(), flowLevel, mood: 'period', symptoms: [] },
      {
        onSuccess: () => { toast('Period logged'); setDate(new Date().toISOString().split('T')[0]); },
        onError: () => toast('Could not save'),
      },
    );
  };

  const submitMood = () => {
    createEntry.mutate(
      { date: new Date().toISOString(), mood, flowLevel: undefined, symptoms: [] },
      {
        onSuccess: () => toast('Mood saved'),
        onError: () => toast('Could not save'),
      },
    );
  };

  const handleDelete = (id: string) => {
    deleteEntry.mutate(id, {
      onSuccess: () => toast('Entry deleted'),
      onError: () => toast('Could not delete'),
    });
  };

  const isDeleting = deleteEntry.isPending;

  return (
    <>
      <PageHeader
        eyebrow="Cycle"
        title="Track your cycle"
        copy="Log your period dates and how you feel. Only you can see this — it is your personal record, not medical data."
        icon={<Heart className="h-6 w-6" />}
      />
      <Section>
        <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
          {/* Left column */}
          <div className="space-y-5">
            {/* Log a period */}
            <Surface>
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-coral-500" />
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
                  Log a period
                </p>
              </div>
              <p className="mt-1 text-xs text-stone-400">Select the date your period started and the flow level.</p>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-500">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-2.5 text-sm font-medium text-stone-900 outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500">Flow level</label>
                  <div className="mt-1 flex gap-1.5">
                    {flowLevels.map((f) => (
                      <button
                        key={f.value}
                        onClick={() => setFlowLevel(f.value)}
                        className={cn(
                          'flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-colors',
                          flowLevel === f.value
                            ? 'bg-coral-500 text-white shadow-sm'
                            : 'bg-white/60 text-stone-600 hover:bg-white',
                        )}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={submitPeriod}
                  disabled={createEntry.isPending || !date}
                  className="w-full rounded-full bg-coral-500 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-coral-600 disabled:opacity-50"
                >
                  {createEntry.isPending ? 'Saving...' : 'Save period'}
                </motion.button>
              </div>
            </Surface>

            {/* Log mood / symptoms */}
            <Surface>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-lavender-500" />
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
                  Log how you feel today
                </p>
              </div>
              <p className="mt-1 text-xs text-stone-400">Not a period — just tracking symptoms and mood.</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {moods.map((item) => (
                  <motion.button
                    key={item}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setMood(item)}
                    className={cn(
                      'rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors',
                      mood === item
                        ? 'bg-lavender-500 text-white'
                        : 'bg-white/60 text-stone-600 hover:bg-white',
                    )}
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={submitMood}
                disabled={createEntry.isPending}
                className="mt-3 w-full rounded-full bg-lavender-500 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-lavender-600 disabled:opacity-50"
              >
                {createEntry.isPending ? 'Saving...' : 'Save mood'}
              </motion.button>
            </Surface>
          </div>

          {/* Right column — entries list */}
          <Surface>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-stone-500" />
              <h3 className="text-lg font-semibold">Your logged days</h3>
            </div>
            <p className="mt-1 text-xs text-stone-400">
              Every entry is used to estimate your cycle phases. Delete any entry to remove it from calculations.
            </p>
            <div className="mt-4 space-y-2">
              {entries.isLoading ? (
                <Skeleton className="h-12 rounded-2xl" count={6} />
              ) : entries.data && entries.data.length > 0 ? (
                [...entries.data].reverse().map((entry, i) => (
                  <motion.div
                    key={entry.id ?? entry.date}
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    className="flex items-center justify-between rounded-2xl bg-white/60 px-4 py-3 transition-colors hover:bg-white/80"
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        'grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold',
                        entry.flowLevel || entry.mood === 'period'
                          ? 'bg-coral-100 text-coral-700'
                          : 'bg-lavender-100 text-lavender-700',
                      )}>
                        {entry.flowLevel || entry.mood === 'period' ? 'P' : 'M'}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-stone-800">
                          {formatShortDate(entry.date)}
                        </p>
                        <p className="text-[0.65rem] font-medium text-stone-400">
                          {entry.flowLevel
                            ? `Period · ${entry.flowLevel} flow`
                            : entry.mood
                              ? `Mood · ${entry.mood}`
                              : 'Logged'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => entry.id && handleDelete(entry.id)}
                      disabled={isDeleting}
                      className="rounded-full p-2 text-stone-400 transition hover:bg-white hover:text-coral-600 disabled:opacity-30"
                      aria-label="Delete entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))
              ) : (
                <EmptyState
                  title="No entries yet"
                  copy="Log your first period or mood to start building your cycle calendar."
                />
              )}
            </div>
          </Surface>
        </div>
      </Section>
    </>
  );
}
