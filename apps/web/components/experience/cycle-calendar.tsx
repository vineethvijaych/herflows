'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Info, Plus } from 'lucide-react';
import { useCycleEntries, useCycleEstimate } from '@/lib/queries';
import { cn } from '@/lib/utils';
import { Section, Skeleton } from '@/components/experience/primitives';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

function getCycleLength(entries: { date: string }[]) {
  if (entries.length < 2) return 28;
  const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let total = 0, count = 0;
  for (let i = 1; i < sorted.length; i++) {
    const diff = Math.round((new Date(sorted[i].date).getTime() - new Date(sorted[i - 1].date).getTime()) / 86400000);
    if (diff > 14 && diff < 60) { total += diff; count++; }
  }
  return count > 0 ? Math.round(total / count) : 28;
}

function daysInMonth(year: number, month: number) { return new Date(year, month + 1, 0).getDate(); }
function startDay(year: number, month: number) { return new Date(year, month, 1).getDay(); }
function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function CycleCalendar() {
  const entries = useCycleEntries();
  const estimate = useCycleEstimate();
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const calendar = useMemo(() => {
    const logged = entries.data ?? [];
    const has = logged.length > 0;
    const cycleLength = getCycleLength(logged);
    const loggedDates = new Set<string>();
    for (const e of logged) loggedDates.add(e.date.split('T')[0]);

    let lastPeriod: Date | null = null;
    if (has) {
      const sorted = [...logged].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      lastPeriod = new Date(sorted[0].date.split('T')[0]);
    }

    const estDate = estimate.data?.estimatedStartDate ?? estimate.data?.nextPeriodDate;
    let nextPeriod: Date | null = null;
    if (estDate) nextPeriod = new Date(estDate);
    else if (lastPeriod) nextPeriod = new Date(lastPeriod.getTime() + cycleLength * 86400000);

    const ovulationDay = Math.max(10, cycleLength - 14);
    const fertileStart = ovulationDay - 5;
    const fertileEnd = ovulationDay + 2;

    const periodDays = new Set<string>();
    const estimatedDays = new Set<string>();
    const fertileDays = new Set<string>();
    const ovulationDays = new Set<string>();

    const dim = daysInMonth(viewYear, viewMonth);
    for (let d = 1; d <= dim; d++) {
      const ds = toDateStr(viewYear, viewMonth, d);
      if (loggedDates.has(ds)) periodDays.add(ds);
    }

    if (nextPeriod) {
      const est = new Date(nextPeriod);
      est.setHours(0, 0, 0, 0);
      for (let i = 0; i < 5; i++) {
        const d = new Date(est.getTime() + i * 86400000);
        const ds = toDateStr(d.getFullYear(), d.getMonth(), d.getDate());
        if (!periodDays.has(ds)) estimatedDays.add(ds);
      }
    }

    if (lastPeriod) {
      const lp = new Date(lastPeriod);
      lp.setHours(0, 0, 0, 0);
      for (let d = fertileStart; d <= fertileEnd; d++) {
        const date = new Date(lp.getTime() + d * 86400000);
        const ds = toDateStr(date.getFullYear(), date.getMonth(), date.getDate());
        if (!periodDays.has(ds) && !estimatedDays.has(ds)) {
          if (d === ovulationDay) ovulationDays.add(ds);
          else fertileDays.add(ds);
        }
      }
    }

    let currentDay = 1;
    let phaseLabel = 'Log your cycle';
    if (lastPeriod) {
      currentDay = Math.max(1, daysBetween(lastPeriod, today) + 1);
      if (currentDay <= 5) phaseLabel = 'Menstruation';
      else if (currentDay <= ovulationDay - 1) phaseLabel = 'Follicular';
      else if (currentDay <= ovulationDay + 1) phaseLabel = 'Ovulation';
      else phaseLabel = 'Luteal';
      if (currentDay > cycleLength + 7) phaseLabel = 'Waiting';
    }

    const summary: { label: string; value: string }[] = [];
    if (lastPeriod) summary.push({ label: 'Last period', value: lastPeriod.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) });
    else summary.push({ label: 'Status', value: 'No periods logged' });
    if (nextPeriod) summary.push({ label: 'Next expected', value: `${nextPeriod.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} (est.)` });
    if (lastPeriod) summary.push({ label: 'Fertile window', value: `~day ${fertileStart}-${fertileEnd} (possibility)` });
    if (has) summary.push({ label: 'Cycle length', value: `~${cycleLength} days (avg)` });

    const start = startDay(viewYear, viewMonth);
    const cells: (number | null)[] = [];
    for (let i = 0; i < start; i++) cells.push(null);
    for (let d = 1; d <= dim; d++) cells.push(d);

    return { cells, periodDays, estimatedDays, fertileDays, ovulationDays, phaseLabel, currentDay, summary, hasEntries: has };
  }, [entries.data, estimate.data, viewYear, viewMonth, today]);

  const loading = entries.isLoading || estimate.isLoading;

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  };
  const goToday = () => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); };

  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  if (loading) {
    return <Section><Skeleton className="h-96 rounded-3xl" /></Section>;
  }

  if (!calendar.hasEntries) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
        <div className="mx-auto max-w-sm">
          <div className="mb-6 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-rose-100 to-coral-100">
            <span className="text-3xl">&#127800;</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-950">Your cycle calendar</h1>
          <p className="mt-3 leading-relaxed text-stone-500">
            Log when your period starts (date + flow) and we will show estimated cycle phases and a possible fertile window. Everything here is a possibility, not a prediction.
          </p>
          <Link href="/cycle-tracker" className="btn-primary mt-8 inline-flex">
            <Plus className="mr-2 h-4 w-4" /> Log your period
          </Link>
        </div>
      </main>
    );
  }

  function cellKind(ds: string): 'period' | 'estimated' | 'fertile' | 'ovulation' | 'none' {
    if (calendar.periodDays.has(ds)) return 'period';
    if (calendar.estimatedDays.has(ds)) return 'estimated';
    if (calendar.ovulationDays.has(ds)) return 'ovulation';
    if (calendar.fertileDays.has(ds)) return 'fertile';
    return 'none';
  }

  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-3 pb-8 pt-16 sm:px-6">
      {/* Phase indicator */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/50 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-stone-500 shadow-soft backdrop-blur-sm">
            <span className={cn(
              'h-1.5 w-1.5 rounded-full',
              calendar.phaseLabel === 'Menstruation' && 'bg-coral-500',
              calendar.phaseLabel === 'Follicular' && 'bg-rose-300',
              calendar.phaseLabel === 'Ovulation' && 'bg-lavender-500',
              calendar.phaseLabel === 'Luteal' && 'bg-sky-400',
              true && 'bg-stone-300',
            )} />
            {calendar.phaseLabel}
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
            {MONTHS[viewMonth]} {viewYear !== today.getFullYear() ? viewYear : ''}
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={prevMonth} className="rounded-full p-2 text-stone-400 transition hover:bg-white/60 hover:text-stone-900">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={goToday} className="rounded-full px-3 py-1.5 text-xs font-semibold text-stone-500 transition hover:bg-white/60 hover:text-stone-900">
            Today
          </button>
          <button onClick={nextMonth} className="rounded-full p-2 text-stone-400 transition hover:bg-white/60 hover:text-stone-900">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="mt-5 rounded-3xl border border-white/60 bg-white/60 p-3 shadow-card backdrop-blur-2xl sm:p-5">
        <div className="grid grid-cols-7 gap-1">
          {DAYS_SHORT.map((d, i) => (
            <div key={`${d}-${i}`} className="py-2 text-center text-xs font-bold uppercase tracking-wider text-stone-400">
              {d}
            </div>
          ))}
          {calendar.cells.map((day, i) => {
            if (day === null) return <div key={`e-${i}`} />;
            const ds = toDateStr(viewYear, viewMonth, day);
            const kind = cellKind(ds);
            const isToday = ds === todayStr;
            return (
              <div
                key={ds}
                className={cn(
                  'relative flex items-center justify-center rounded-xl py-3 text-sm font-medium transition-colors',
                  kind === 'period' && 'bg-coral-500 text-white shadow-sm',
                  kind === 'estimated' && 'bg-rose-50 text-rose-700',
                  kind === 'fertile' && 'bg-emerald-50 text-emerald-700',
                  kind === 'ovulation' && 'bg-lavender-200 text-lavender-800',
                  kind === 'none' && !isToday && 'text-stone-600 hover:bg-white/60',
                  isToday && kind === 'none' && 'ring-2 ring-stone-400 ring-offset-1 text-stone-900',
                  isToday && kind !== 'none' && 'ring-2 ring-white ring-offset-1',
                )}
              >
                {day}
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.65rem] font-medium text-stone-500">
          <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-coral-500" /> You logged a period</span>
          <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full border border-rose-200 bg-rose-50" /> Possible period (est.)</span>
          <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full border border-emerald-200 bg-emerald-50" /> Possible fertile window</span>
          <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full border border-lavender-300 bg-lavender-200" /> Possible ovulation</span>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-2xl bg-amber-50 px-3.5 py-2.5 text-[0.65rem] leading-5 text-amber-700">
          <Info className="mt-0.5 h-3 w-3 shrink-0" />
          <span>Colored days show <strong>your logged dates</strong> (coral) and <strong>estimated possibilities</strong> (all other colors) based on your entries. This is not medical advice.</span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {calendar.summary.map((item, i) => (
          <div key={i} className="rounded-2xl border border-white/60 bg-white/50 px-3.5 py-3 shadow-soft backdrop-blur-sm">
            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-stone-400">{item.label}</p>
            <p className="mt-1 text-sm font-semibold text-stone-800">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-5 flex items-center justify-center gap-3">
        <Link href="/cycle-tracker" className="btn-primary text-sm">
          <Plus className="mr-1.5 h-4 w-4" /> Log today
        </Link>
        <Link href="/dashboard" className="btn-secondary text-sm">
          Dashboard
        </Link>
      </div>
    </main>
  );
}
