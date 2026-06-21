'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LockKeyhole, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Section, Surface } from '@/components/experience/primitives';
import { useHerFlowsStore } from '@/lib/store';
import { api } from '@/lib/api';

export function AuthExperience({ mode }: { mode: 'login' | 'register' }) {
  const schema = z.object({
    name:
      mode === 'register' ? z.string().min(2, 'Name is required') : z.string().optional(),
    email: z.string().email('Use a valid email'),
    password: z.string().min(6, 'Use at least 6 characters'),
  });
  type FormValues = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { name: '', email: '', password: '' } });
  const setAuth = useHerFlowsStore((s) => s.setAuth);

  const onSubmit = async (values: FormValues) => {
    const response = await api.post<{ accessToken?: string; refreshToken?: string }>(
      `/auth/${mode}`,
      values,
    );
    if (response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken);
      if (response.refreshToken) localStorage.setItem('refreshToken', response.refreshToken);
      setAuth(response.accessToken);
    }
    window.location.href = mode === 'register' ? '/onboarding' : '/dashboard';
  };

  return (
    <Section className="grid min-h-[calc(100vh-8rem)] place-items-center">
      <Surface className="w-full max-w-md">
        <LockKeyhole className="mb-6 h-6 w-6 text-rose-500" />
        <h1 className="text-3xl font-semibold tracking-tight">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="mt-3 text-stone-600">
          {mode === 'login'
            ? 'Sign in to your account.'
            : 'Create your account to get started.'}
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {mode === 'register' && (
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
                Name
              </span>
              <input
                {...register('name')}
                className="mt-2 w-full rounded-2xl border border-white/80 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-300"
                placeholder="Your name"
              />
              {errors.name && (
                <span className="mt-1 block text-sm text-rose-600">{errors.name.message}</span>
              )}
            </label>
          )}
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
              Email
            </span>
            <input
              type="email"
              {...register('email')}
              className="mt-2 w-full rounded-2xl border border-white/80 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-300"
              placeholder="your@email.com"
            />
            {errors.email && (
              <span className="mt-1 block text-sm text-rose-600">{errors.email.message}</span>
            )}
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
              Password
            </span>
            <input
              type="password"
              {...register('password')}
              className="mt-2 w-full rounded-2xl border border-white/80 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-300"
              placeholder="At least 6 characters"
            />
            {errors.password && (
              <span className="mt-1 block text-sm text-rose-600">
                {errors.password.message}
              </span>
            )}
          </label>

          {mode === 'login' && (
            <div className="text-right">
              <Link
                href="/auth/forgot-password"
                className="text-sm font-semibold text-stone-500 transition-colors hover:text-rose-600"
              >
                Forgot password?
              </Link>
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={isSubmitting}
            className="w-full rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-soft"
          >
            {isSubmitting
              ? 'Please wait...'
              : mode === 'login'
                ? 'Sign in'
                : 'Create account'}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-stone-500">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <Link href="/auth/register" className="font-semibold text-stone-950 transition-colors hover:text-rose-600">
                Create one <ArrowRight className="ml-0.5 inline h-3.5 w-3.5" />
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link href="/auth/login" className="font-semibold text-stone-950 transition-colors hover:text-rose-600">
                Sign in <ArrowRight className="ml-0.5 inline h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>
      </Surface>
    </Section>
  );
}
