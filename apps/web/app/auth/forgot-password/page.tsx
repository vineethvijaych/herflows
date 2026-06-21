'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Section, Surface } from '@/components/experience/primitives';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call POST /auth/forgot-password when backend supports it
    setSent(true);
  };

  return (
    <Section className="grid min-h-[calc(100vh-8rem)] place-items-center">
      <Surface className="w-full max-w-md">
        <KeyRound className="mb-6 h-6 w-6 text-rose-500" />
        <h1 className="text-3xl font-semibold tracking-tight">Reset your password</h1>

        {sent ? (
          <div className="mt-8 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-emerald-500" />
            <p className="mt-4 text-stone-600">
              If an account exists for <strong>{email}</strong>, you'll receive a reset link shortly.
            </p>
            <Link
              href="/auth/login"
              className="mt-6 inline-flex items-center text-sm font-semibold text-stone-500 transition-colors hover:text-rose-600"
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-3 text-stone-600">
              Enter your email and we'll send you a reset link.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
                  Email
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/80 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-300"
                  placeholder="your@email.com"
                />
              </label>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated"
              >
                Send reset link
              </motion.button>
            </form>
            <div className="mt-6 text-center text-sm text-stone-500">
              Remember your password?{' '}
              <Link href="/auth/login" className="font-semibold text-stone-950 transition-colors hover:text-rose-600">
                Sign in
              </Link>
            </div>
          </>
        )}
      </Surface>
    </Section>
  );
}
