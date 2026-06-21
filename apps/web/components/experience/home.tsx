'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Heart,
  BookOpen,
  Wand2,
  PackageCheck,
  Leaf,
  Star,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Section, Surface } from '@/components/experience/primitives';
import { useHerFlowsStore } from '@/lib/store';
import { CycleCalendar } from '@/components/experience/cycle-calendar';

const ease = [0.16, 1, 0.3, 1];

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

export function HomeExperience() {
  const isAuthenticated = useHerFlowsStore((s) => s.isAuthenticated);
  const shouldReduceMotion = useReducedMotion();

  if (isAuthenticated) {
    return <CycleCalendar />;
  }

  const animProps = (delay = 0) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-60px' },
          transition: { duration: 0.6, delay, ease },
        };

  return (
    <div className="overflow-hidden">
      <Hero shouldReduceMotion={!!shouldReduceMotion} />
      <Mission animProps={animProps} />
      <ProblemSolution animProps={animProps} />
      <HowItWorks animProps={animProps} shouldReduceMotion={!!shouldReduceMotion} />
      <Benefits animProps={animProps} shouldReduceMotion={!!shouldReduceMotion} />
      <Personalization animProps={animProps} shouldReduceMotion={!!shouldReduceMotion} />
      <EducationHighlight animProps={animProps} />
      <Testimonials animProps={animProps} shouldReduceMotion={!!shouldReduceMotion} />
      <FAQ animProps={animProps} />
      <FinalCTA animProps={animProps} />
      <Disclaimer />
    </div>
  );
}

function Hero({ shouldReduceMotion }: { shouldReduceMotion: boolean }) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-24 sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.25] [background-image:linear-gradient(rgba(65,53,45,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(65,53,45,0.06)_1px,transparent_1px)] [background-size:48px_48px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_30%_20%,rgba(232,90,74,0.12),transparent_50%),radial-gradient(ellipse_at_70%_80%,rgba(251,113,133,0.08),transparent_50%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 h-[500px] w-[500px] animate-float rounded-full bg-[radial-gradient(circle,rgba(232,90,74,0.2),transparent_70%)] blur-3xl"
        style={{ top: '10%', right: '5%' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 h-[400px] w-[400px] animate-float-slow rounded-full bg-[radial-gradient(circle,rgba(251,113,133,0.15),transparent_70%)] blur-3xl"
        style={{ bottom: '20%', left: '10%' }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/55 px-4 py-2 text-sm font-medium text-stone-600 shadow-glass backdrop-blur-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            Private &amp; secure. Always.
          </div>
        </motion.div>

        <motion.h1
          initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: shouldReduceMotion ? 0 : 0.1, ease }}
          className="text-5xl font-semibold leading-[0.94] tracking-tight text-stone-950 sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Your body.
          <br />
          <span className="bg-gradient-to-r from-coral-500 to-rose-500 bg-clip-text text-transparent">Your rhythm.</span>
          <br />
          Your wellness.
        </motion.h1>

        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : 0.25, ease }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-stone-600 sm:text-xl"
        >
          Personalized cycle care that adapts to your unique body. Products, knowledge, and support — curated for every phase of you.
        </motion.p>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : 0.35, ease }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/auth/register"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-stone-950 px-7 text-sm font-semibold text-white shadow-elevated transition-all hover:-translate-y-0.5 hover:bg-stone-800 hover:shadow-glow-coral"
          >
            Begin your journey
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a
            href="#mission"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-white/60 bg-white/55 px-7 text-sm font-semibold text-stone-700 shadow-glass backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/80 hover:shadow-glass-lg"
          >
            Learn more
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </a>
        </motion.div>

        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : 0.5 }}
          className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-stone-400"
        >
          <ShieldCheck className="mr-1.5 inline h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
          Private &amp; secure. Always.
        </motion.p>
      </div>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: shouldReduceMotion ? 0 : 0.3, ease }}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#mission" className="block animate-bounce-gentle text-stone-400">
          <ChevronDown className="h-6 w-6" />
        </a>
      </motion.div>
    </section>
  );
}

function Mission({ animProps }: { animProps: (delay?: number) => Record<string, unknown> }) {
  const pillars = [
    { icon: Heart, title: 'Track your rhythm', copy: 'Understand your cycle with tools designed for your body, not a calendar.' },
    { icon: PackageCheck, title: 'Build your kit', copy: 'Curate products that match your flow, your sensitivities, and your lifestyle.' },
    { icon: BookOpen, title: 'Learn & grow', copy: 'Explore evidence-based knowledge about your body, on your terms.' },
  ];

  return (
    <Section id="mission" eyebrow="Our purpose" title="Wellness that adapts to you" copy="We believe period care should be as unique as you are. No assumptions, no guesswork — just thoughtful support for every cycle.">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="mt-12 grid gap-6 md:grid-cols-3"
      >
        {pillars.map((pillar) => (
          <motion.div
            key={pillar.title}
            variants={fadeUp}
            className="group rounded-3xl border border-white/70 bg-white/62 p-7 shadow-card backdrop-blur-2xl transition-all hover:-translate-y-1 hover:bg-white/78 hover:shadow-card-hover"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-stone-950 text-white transition-colors group-hover:bg-coral-500">
              <pillar.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-stone-950">{pillar.title}</h3>
            <p className="mt-3 leading-7 text-stone-600">{pillar.copy}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

function ProblemSolution({ animProps }: { animProps: (delay?: number) => Record<string, unknown> }) {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(232,90,74,0.05),transparent_60%)]"
      />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="grid items-center gap-12 lg:grid-cols-2"
      >
        <motion.div variants={fadeUp} className="rounded-3xl border border-white/70 bg-white/62 p-8 shadow-card backdrop-blur-2xl sm:p-10">
          <span className="mb-4 inline-flex items-center rounded-full bg-stone-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-stone-600">
            The problem
          </span>
          <h3 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Period care shouldn&apos;t be one-size-fits-all
          </h3>
          <p className="mt-5 leading-8 text-stone-600">
            Generic products ignore your unique flow, sensitivities, and lifestyle. Most subscription boxes guess what you need —
            leaving you with products that don&apos;t fit, waste, and frustration.
          </p>
          <ul className="mt-6 space-y-3">
            {['No personalization', 'Trial-and-error every month', 'Disconnected from your real needs'].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-6 text-stone-500">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-300" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={fadeUp} className="rounded-3xl border border-white/70 bg-white/62 p-8 shadow-card backdrop-blur-2xl sm:p-10">
          <span className="mb-4 inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-rose-700">
            Our approach
          </span>
          <h3 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Personalized, adaptive, and intentional
          </h3>
          <p className="mt-5 leading-8 text-stone-600">
            HerFlows learns from your cycle, preferences, and feedback to curate products that truly work for you. No guesses. No waste. Just
            what you need, when you need it.
          </p>
          <ul className="mt-6 space-y-3">
            {['Tailored to your cycle phase', 'Adjusts as your body changes', 'Products you actually want to use'].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-6 text-stone-500">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
}

function HowItWorks({ animProps, shouldReduceMotion }: { animProps: (delay?: number) => Record<string, unknown>; shouldReduceMotion: boolean }) {
  const steps = [
    { icon: Heart, title: 'Understand', copy: 'Tell us about your cycle — what matters to you, what doesn\'t.' },
    { icon: Wand2, title: 'Curate', copy: 'We help you build a kit that aligns with your flow and values.' },
    { icon: PackageCheck, title: 'Subscribe', copy: 'Choose your delivery rhythm. Pause or adjust anytime.' },
    { icon: Sparkles, title: 'Thrive', copy: 'Receive your kit, learn as you go, and evolve with your body.' },
  ];

  return (
    <Section eyebrow="Your journey" title="Your flow, your way" copy="Four simple steps to a routine that actually fits your life.">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {steps.map((step, i) => (
          <motion.div key={step.title} variants={fadeUp} className="relative">
            {i < steps.length - 1 && (
              <div
                aria-hidden="true"
                className="absolute right-0 top-8 hidden h-px w-[calc(100%+1.5rem)] bg-gradient-to-r from-stone-200 to-transparent lg:block"
                style={{ left: 'calc(100% + 0.75rem)' }}
              />
            )}
            <div className="rounded-3xl border border-white/70 bg-white/62 p-7 shadow-card backdrop-blur-2xl">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-stone-950 text-white">
                <step.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-coral-500">Step {i + 1}</span>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">{step.title}</h3>
              <p className="mt-3 leading-7 text-stone-600">{step.copy}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

function Benefits({ animProps, shouldReduceMotion }: { animProps: (delay?: number) => Record<string, unknown>; shouldReduceMotion: boolean }) {
  const benefits = [
    { icon: Heart, title: 'Personalized for you', copy: 'Every product matched to your cycle, preferences, and body.' },
    { icon: PackageCheck, title: 'Delivered discreetly', copy: 'Sustainably packaged and shipped in plain, planet-friendly boxes.' },
    { icon: Leaf, title: 'Sustainably sourced', copy: 'Organic, biodegradable, and ethically made products you can feel good about.' },
    { icon: BookOpen, title: 'Expert-guided', copy: 'Content reviewed by health professionals. Knowledge you can trust.' },
    { icon: ShieldCheck, title: 'Privacy first', copy: 'Your data stays yours. We never share or sell your personal information.' },
    { icon: Sparkles, title: 'Flexible & pause anytime', copy: 'Life changes. Your subscription changes with it — no questions asked.' },
  ];

  return (
    <Section eyebrow="Why HerFlows" title="More than just products" copy="Every detail designed with your well-being in mind.">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {benefits.map((benefit) => (
          <motion.div
            key={benefit.title}
            variants={fadeUp}
            className="group rounded-3xl border border-white/70 bg-white/62 p-6 shadow-card backdrop-blur-2xl transition-all hover:-translate-y-1 hover:bg-white/78 hover:shadow-card-hover"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-stone-950 text-white transition-colors group-hover:bg-coral-500">
              <benefit.icon className="h-4 w-4" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-stone-950">{benefit.title}</h3>
            <p className="mt-2 leading-7 text-stone-600">{benefit.copy}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

function Personalization({ animProps, shouldReduceMotion }: { animProps: (delay?: number) => Record<string, unknown>; shouldReduceMotion: boolean }) {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_50%,rgba(251,113,133,0.06),transparent_50%)]"
      />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <motion.div variants={fadeUp}>
          <span className="mb-4 inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-rose-700">
            Built for you
          </span>
          <h2 className="text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            A routine built <span className="bg-gradient-to-r from-coral-500 to-rose-500 bg-clip-text text-transparent">around you</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">
            Your cycle isn&apos;t static, and neither is your care. HerFlows adapts your product selection, delivery schedule, and
            educational content based on your unique patterns and feedback.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              { label: 'Cycle-aware recommendations', desc: 'Products that match your current phase' },
              { label: 'Adaptive delivery timing', desc: 'Arrives when you actually need it' },
              { label: 'Personalized learning', desc: 'Content that grows with your knowledge' },
            ].map((item) => (
              <li key={item.label} className="flex gap-4">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-coral-100">
                  <Sparkles className="h-3 w-3 text-coral-600" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-stone-950">{item.label}</p>
                  <p className="text-sm text-stone-500">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="relative mx-auto aspect-square w-full max-w-sm"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-coral-200/40 via-rose-200/30 to-peach-200/40 shadow-glow-coral" />
          <div className="relative flex h-full items-center justify-center">
            <div className="rounded-3xl border border-white/70 bg-white/62 p-8 shadow-card backdrop-blur-2xl text-center">
              <Heart className="mx-auto h-10 w-10 text-coral-500" aria-hidden="true" />
              <p className="mt-4 text-lg font-semibold text-stone-950">Your rhythm</p>
              <p className="mt-1 text-sm text-stone-500">is one of a kind</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function EducationHighlight({ animProps }: { animProps: (delay?: number) => Record<string, unknown> }) {
  return (
    <Section eyebrow="Learn" title="Know your body, your way" copy="Explore our library of evidence-based articles, guides, and resources — crafted to help you understand every phase.">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="mt-12"
      >
        <motion.div variants={fadeUp} className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/62 shadow-card backdrop-blur-2xl transition-all hover:bg-white/78">
          <Link href="/education" className="flex items-center justify-between p-8 sm:p-10">
            <div className="flex items-center gap-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-950 text-white">
                <BookOpen className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-stone-950">Explore the Learn library</h3>
                <p className="mt-2 text-stone-600">Cycle science, wellness tips, and body literacy — all in one place.</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-coral-600 transition-all group-hover:translate-x-1">
              Browse articles
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </Link>
        </motion.div>
      </motion.div>
    </Section>
  );
}

function Testimonials({ animProps, shouldReduceMotion }: { animProps: (delay?: number) => Record<string, unknown>; shouldReduceMotion: boolean }) {
  const testimonials = [
    { name: 'Priya M.', role: 'Member since 2024', quote: 'I finally feel like my period care is actually designed for me. The kit adapts to how I\'m feeling each month — it\'s incredible.' },
    { name: 'Ananya S.', role: 'Member since 2023', quote: 'The learning content alone has been transformative. I understand my body so much better now, and the products are perfect.' },
    { name: 'Rhea K.', role: 'Member since 2024', quote: 'No more overflowing cabinets with products I don\'t use. HerFlows sends exactly what I need, when I need it.' },
    { name: 'Neha R.', role: 'Member since 2024', quote: 'Privacy was my biggest concern, but everything is handled so thoughtfully. I love that I\'m in complete control.' },
  ];

  return (
    <Section eyebrow="Real voices" title="What our community says" copy="Hear from people who\'ve made HerFlows part of their rhythm.">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="mt-12 grid gap-6 md:grid-cols-2"
      >
        {testimonials.map((t) => (
          <motion.div
            key={t.name}
            variants={fadeUp}
            className="rounded-3xl border border-white/70 bg-white/62 p-7 shadow-card backdrop-blur-2xl"
          >
            <div className="mb-4 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
              ))}
            </div>
            <blockquote className="text-base leading-7 text-stone-700">&ldquo;{t.quote}&rdquo;</blockquote>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-950 text-[11px] font-bold text-white">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-950">{t.name}</p>
                <p className="text-xs text-stone-400">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

const faqs = [
  { q: 'How does the kit work?', a: 'After telling us about your cycle and preferences, we curate a personalized kit of products matched to your needs. You review, adjust, and choose your delivery rhythm. Each month, your kit adapts based on your feedback and cycle patterns.' },
  { q: 'Can I pause or cancel?', a: 'Absolutely. You can pause, skip, or cancel your subscription at any time — directly from your account, with no penalties. Your kit, your schedule.' },
  { q: 'Is my data private?', a: 'Yes. Your health data belongs to you. We never share or sell it. All information is encrypted and used solely to personalize your experience. You can delete your data at any time.' },
  { q: 'How are products chosen?', a: 'Products are selected based on your cycle phase, flow intensity, sensitivities, and preferences. We partner with trusted, sustainable brands and continuously refine recommendations as you provide feedback.' },
  { q: 'What if I need help?', a: 'Our support team is here for you. Reach out via chat or email and we\'ll help with anything — product questions, account changes, or just to listen.' },
];

function FAQ({ animProps }: { animProps: (delay?: number) => Record<string, unknown> }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section eyebrow="Questions" title="Frequently asked questions">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="mt-12 mx-auto max-w-3xl space-y-3"
      >
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="overflow-hidden rounded-2xl border border-white/60 bg-white/55 shadow-glass backdrop-blur-sm transition-colors hover:bg-white/70"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between px-6 py-5 text-left"
              aria-expanded={openIndex === i}
            >
              <span className="pr-4 text-base font-semibold text-stone-950">{faq.q}</span>
              <motion.span
                animate={{ rotate: openIndex === i ? 180 : 0 }}
                transition={{ duration: 0.3, ease }}
                className="shrink-0 text-stone-400"
              >
                <ChevronDown className="h-5 w-5" aria-hidden="true" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {openIndex === i && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-stone-200/50 px-6 pb-5 pt-4">
                    <p className="text-base leading-7 text-stone-600">{faq.a}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

function FinalCTA({ animProps }: { animProps: (delay?: number) => Record<string, unknown> }) {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-32 text-center sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(232,90,74,0.08),transparent_50%)]"
      />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
      >
        <motion.span
          variants={fadeUp}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/55 px-4 py-2 text-sm font-medium text-stone-600 shadow-glass"
        >
          <Sparkles className="h-4 w-4 text-coral-500" aria-hidden="true" />
          Join thousands finding their flow
        </motion.span>
        <motion.h2
          variants={fadeUp}
          className="text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl lg:text-6xl"
        >
          Ready to find your flow?
        </motion.h2>
        <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-lg text-lg leading-8 text-stone-600">
          Start your wellness journey today. Free to explore, easy to personalize, and always in your control.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-10">
          <Link
            href="/auth/register"
            className="inline-flex h-14 items-center gap-3 rounded-full bg-stone-950 px-10 text-base font-semibold text-white shadow-elevated transition-all hover:-translate-y-0.5 hover:bg-stone-800 hover:shadow-glow-coral"
          >
            Create your free account
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </motion.div>
        <motion.p
          variants={fadeUp}
          className="mt-5 text-sm text-stone-400"
        >
          <ShieldCheck className="mr-1 inline h-4 w-4 text-emerald-600" aria-hidden="true" />
          No commitment. Pause or cancel anytime.
        </motion.p>
      </motion.div>
    </section>
  );
}

function Disclaimer() {
  return (
    <div className="border-t border-white/40 bg-white/20 py-6 text-center">
      <p className="px-4 text-xs leading-5 text-stone-400">
        Educational purposes only, not medical advice. HerFlows provides personalized wellness recommendations based on information you
        share, but does not diagnose, treat, or prevent any medical condition. Always consult a healthcare professional for medical
        concerns.
      </p>
    </div>
  );
}
