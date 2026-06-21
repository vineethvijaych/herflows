'use client';

import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const ease = [0.16, 1, 0.3, 1];

export type SectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  copy?: string | ReactNode;
  children?: ReactNode;
  className?: string;
  narrow?: boolean;
};

export function Section({ id, eyebrow, title, copy, children, className, narrow }: SectionProps) {
  return (
    <section id={id} className={cn('mx-auto w-full px-4 py-12 sm:px-6 lg:px-8', narrow ? 'max-w-4xl' : 'max-w-7xl', className)}>
      {(eyebrow || title || copy) && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease }}
          className="mb-10 max-w-3xl"
        >
          {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-coral-500">{eyebrow}</p>}
          {title && <h2 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl lg:text-5xl">{title}</h2>}
          {copy && (typeof copy === 'string' ? <p className="mt-3 text-base leading-7 text-stone-600">{copy}</p> : copy)}
        </motion.div>
      )}
      {children}
    </section>
  );
}

const surfaceVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease },
  }),
};

export type SurfaceProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'article' | 'aside';
  hover?: boolean;
};

export function Surface({ children, className, delay = 0, as: Tag = 'div', hover }: SurfaceProps) {
  return (
    <motion.div
      variants={surfaceVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      custom={delay}
      className={cn(
        'rounded-3xl border border-white/70 bg-white/62 p-6 shadow-card backdrop-blur-2xl',
        hover && 'card-hover',
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

export function EmptyState({ title, copy, icon }: { title: string; copy: string; icon?: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease }}
      className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-stone-300/60 bg-white/45 p-8 text-center"
    >
      {icon && <div className="text-stone-400">{icon}</div>}
      <p className="font-semibold text-stone-950">{title}</p>
      <p className="max-w-sm text-sm leading-6 text-stone-600">{copy}</p>
    </motion.div>
  );
}

export function Metric({ label, value, tone = 'rose', trend }: { label: string; value: string | number; tone?: 'rose' | 'sage' | 'ink' | 'gold' | 'lavender'; trend?: 'up' | 'down' | 'neutral' }) {
  const tones: Record<string, string> = {
    rose: 'bg-rose-100 text-rose-700',
    sage: 'bg-emerald-100 text-emerald-800',
    ink: 'bg-stone-950 text-white',
    gold: 'bg-amber-100 text-amber-800',
    lavender: 'bg-lavender-100 text-lavender-700',
  };

  const trendIcon = trend === 'up' ? '\u2191' : trend === 'down' ? '\u2193' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease }}
      className="rounded-2xl bg-white/58 p-5"
    >
      <p className={cn('mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em]', tones[tone])}>
        {label}
        {trendIcon && <span className="text-xs">{trendIcon}</span>}
      </p>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="text-3xl font-semibold tracking-tight text-stone-950"
      >
        {value}
      </motion.p>
    </motion.div>
  );
}

export function Button({ children, className, variant = 'primary', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }) {
  const variants: Record<string, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-primary bg-red-600 hover:bg-red-700',
  };

  return (
    <button className={cn(variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export const Field = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }>(
  ({ label, error, className, ...props }, ref) => (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-stone-400">{label}</span>
      <input
        ref={ref}
        className={cn('input-base', error && 'border-red-300 ring-2 ring-red-200/50', className)}
        {...props}
      />
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  ),
);

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }>(
  ({ label, error, className, ...props }, ref) => (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-stone-400">{label}</span>
      <textarea
        ref={ref}
        className={cn('input-base min-h-[120px] resize-y', error && 'border-red-300 ring-2 ring-red-200/50', className)}
        {...props}
      />
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  ),
);

export type BadgeProps = {
  children: ReactNode;
  className?: string;
  variant?: 'rose' | 'sage' | 'amber' | 'lavender' | 'stone';
};

export function Badge({ children, className, variant = 'stone' }: BadgeProps) {
  const variants: Record<string, string> = {
    rose: 'bg-rose-100 text-rose-700 border-rose-200/50',
    sage: 'bg-emerald-100 text-emerald-700 border-emerald-200/50',
    amber: 'bg-amber-100 text-amber-700 border-amber-200/50',
    lavender: 'bg-lavender-100 text-lavender-700 border-lavender-200/50',
    stone: 'bg-stone-100 text-stone-700 border-stone-200/50',
  };

  return (
    <span className={cn('inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]', variants[variant], className)}>
      {children}
    </span>
  );
}

export type StepIndicatorProps = {
  steps: string[];
  current: number;
  onStep?: (index: number) => void;
};

export function StepIndicator({ steps, current, onStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2" role="tablist" aria-label="Progress steps">
      {steps.map((step, index) => {
        const isActive = index === current;
        const isComplete = index < current;
        return (
          <button
            key={step}
            role="tab"
            aria-selected={isActive}
            aria-label={`Step ${index + 1}: ${step}`}
            onClick={() => onStep?.(index)}
            className={cn(
              'group flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all duration-300',
              isActive && 'bg-stone-950 text-white shadow-lg',
              isComplete && 'text-stone-500 hover:bg-white/60',
              !isActive && !isComplete && 'text-stone-400',
            )}
          >
            <span className={cn(
              'grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-all duration-300',
              isActive && 'bg-white/20 text-white',
              isComplete && 'bg-emerald-100 text-emerald-700',
              !isActive && !isComplete && 'bg-stone-100 text-stone-400',
            )}>
              {isComplete ? '\u2713' : index + 1}
            </span>
            <span className="hidden sm:inline">{step}</span>
          </button>
        );
      })}
    </div>
  );
}

export type AnimatedCounterProps = {
  value: number;
  className?: string;
};

export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  return (
    <motion.span
      key={value}
      initial={{ scale: 1.3, opacity: 0.5 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2, ease }}
      className={cn('tabular-nums', className)}
    >
      {value}
    </motion.span>
  );
}

export type DividerProps = {
  className?: string;
  label?: string;
};

export function Divider({ className, label }: DividerProps) {
  return (
    <div className={cn('relative flex items-center', className)}>
      <div className="flex-1 border-t border-white/40" />
      {label && <span className="mx-4 text-xs font-bold uppercase tracking-[0.16em] text-stone-400">{label}</span>}
      {label && <div className="flex-1 border-t border-white/40" />}
    </div>
  );
}

export type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  copy?: string;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function PageHeader({ eyebrow, title, copy, icon, children, className }: PageHeaderProps) {
  return (
    <section className={cn('mx-auto max-w-7xl px-4 pb-6 pt-20 sm:px-6 lg:px-8', className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <div className="flex items-start gap-5">
          {icon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-stone-950 text-white shadow-lg"
            >
              {icon}
            </motion.div>
          )}
          <div className="min-w-0">
            {eyebrow && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="text-xs font-bold uppercase tracking-[0.24em] text-coral-500"
              >
                {eyebrow}
              </motion.p>
            )}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-2 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl"
            >
              {title}
            </motion.h1>
            {copy && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="mt-3 max-w-2xl text-lg leading-8 text-stone-600"
              >
                {copy}
              </motion.p>
            )}
            {children}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export type SkeletonProps = {
  className?: string;
  count?: number;
};

export function Skeleton({ className, count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cn('skeleton-shimmer', className)} />
      ))}
    </>
  );
}

export function CardGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('grid gap-5 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {children}
    </div>
  );
}

export type FloatingCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function FloatingCard({ children, className, delay = 0 }: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease }}
      className={cn('rounded-3xl border border-white/70 bg-white/62 p-6 shadow-card backdrop-blur-2xl', className)}
    >
      {children}
    </motion.div>
  );
}

export type PillNavProps = {
  items: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function PillNav({ items, value, onChange, className }: PillNavProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => onChange(item.value)}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200',
            value === item.value
              ? 'bg-stone-950 text-white shadow-lg'
              : 'bg-white/60 text-stone-600 hover:bg-white hover:text-stone-900',
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

const MotionLink = motion.create(Link);

export type ActionCardProps = {
  href: string;
  icon: ReactNode;
  title: string;
  copy: string;
  featured?: boolean;
  className?: string;
};

export function ActionCard({ href, icon, title, copy, featured, className }: ActionCardProps) {
  return (
    <MotionLink
      href={href}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/70 bg-white/62 p-6 shadow-card backdrop-blur-2xl transition-colors hover:bg-white/78',
        featured && 'sm:col-span-2 sm:row-span-2',
        className,
      )}
    >
      {featured && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(251,113,133,0.3),transparent_70%)]"
        />
      )}
      <div>
        <div className={cn(
          'mb-6 flex items-center justify-center rounded-xl bg-stone-950 text-white',
          featured ? 'h-14 w-14' : 'h-12 w-12',
        )}>
          {icon}
        </div>
        <h3 className={cn('font-semibold tracking-tight text-stone-950', featured ? 'text-2xl' : 'text-xl')}>
          {title}
        </h3>
        <p className="mt-3 leading-7 text-stone-600">{copy}</p>
      </div>
      <span className="mt-6 inline-flex items-center text-sm font-semibold text-coral-600 transition-all group-hover:translate-x-1">
        Continue
        <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </MotionLink>
  );
}
