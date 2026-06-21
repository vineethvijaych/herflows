'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, ArrowRight, ShieldCheck, CalendarDays, UserRound } from 'lucide-react';
import {
  Section,
  Surface,
  PageHeader,
  StepIndicator,
  Button,
  Badge,
} from '@/components/experience/primitives';
import { useSaveOnboarding, useUpdateProfile } from '@/lib/queries';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useToastStore } from '@/components/experience/toast';

const STEPS = ['Consent', 'Your Cycle', 'Preferences', 'Profile'];
const EASE = [0.16, 1, 0.3, 1];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
};

const preferences = [
  'Sensitive skin',
  'Heavy flow support',
  'Low waste options',
  'Pain comfort',
  'Travel ready',
];

export function OnboardingExperience() {
  const toast = useToastStore((s) => s.addToast);
  const saveOnboarding = useSaveOnboarding();
  const updateProfile = useUpdateProfile();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);

  const goNext = useCallback(() => { setDir(1); setStep((s) => Math.min(s + 1, 3)); }, []);
  const goBack = useCallback(() => { setDir(-1); setStep((s) => Math.max(s - 1, 0)); }, []);

  const [consent, setConsent] = useState({ privacy: false, terms: false, disclaimer: false });
  const [survey, setSurvey] = useState({ lastPeriod: '', cycleLength: '', flowIntensity: '' });
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState('');

  const allConsented = consent.privacy && consent.terms && consent.disclaimer;
  const canContinueSurvey = survey.lastPeriod && survey.cycleLength && survey.flowIntensity;

  const save = async () => {
    if (name) {
      updateProfile.mutate({ name });
    }

    saveOnboarding.mutate(
      { preferences: selected },
      {
        onSuccess: async () => {
          try {
            if (consent.privacy) await api.post('/consents', { policyType: 'privacy_policy' }).catch(() => {});
            if (consent.terms) await api.post('/consents', { policyType: 'terms_and_conditions' }).catch(() => {});
            if (consent.disclaimer) await api.post('/consents', { policyType: 'medical_disclaimer' }).catch(() => {});

            if (survey.lastPeriod) {
              await api.post('/cycle/entries', {
                date: new Date(survey.lastPeriod).toISOString(),
                flowLevel: survey.flowIntensity,
                mood: 'onboarding',
              }).catch(() => {});
            }
          } catch {}
          toast('All set!');
          window.location.href = '/dashboard';
        },
        onError: () => toast('Could not save preferences'),
      },
    );
  };

  return (
    <>
      <PageHeader
        eyebrow="Welcome"
        title="Let's get to know you"
        copy="A few quick questions to personalize your experience. This helps us recommend what works for you."
        icon={<Sparkles className="h-6 w-6" />}
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <StepIndicator steps={STEPS} current={step} onStep={setStep} />

          <div className="relative mt-10 min-h-[360px]">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: EASE }}
              >
                {step === 0 && (
                  <div className="space-y-6">
                    <Surface className="border-rose-200/60 bg-rose-50/30">
                      <ShieldCheck className="mb-4 h-6 w-6 text-rose-500" />
                      <h3 className="text-xl font-semibold text-stone-950">Your privacy matters</h3>
                      <p className="mt-3 leading-7 text-stone-600">
                        HerFlows takes your privacy seriously. Your cycle data is encrypted, never shared,
                        and used only to personalize your experience. You can delete your data anytime.
                      </p>
                      <p className="mt-2 text-sm leading-6 text-stone-500">
                        This is not medical diagnosis. Cycle estimates are based on what you share.
                      </p>
                    </Surface>

                    <div className="space-y-3">
                      {[
                        { key: 'privacy' as const, label: 'I agree to the Privacy Policy and how my data is handled' },
                        { key: 'terms' as const, label: 'I accept the Terms & Conditions' },
                        { key: 'disclaimer' as const, label: 'I understand this is not medical advice or diagnosis' },
                      ].map((item) => (
                        <label
                          key={item.key}
                          className={cn(
                            'flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-colors',
                            consent[item.key]
                              ? 'border-rose-300 bg-rose-50/50'
                              : 'border-white/70 bg-white/50 hover:bg-white/70',
                          )}
                        >
                          <span className={cn(
                            'mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors',
                            consent[item.key]
                              ? 'border-rose-500 bg-rose-500 text-white'
                              : 'border-stone-300',
                          )}>
                            {consent[item.key] && <Check className="h-3.5 w-3.5" />}
                          </span>
                          <input
                            type="checkbox"
                            checked={consent[item.key]}
                            onChange={() => setConsent((c) => ({ ...c, [item.key]: !c[item.key] }))}
                            className="sr-only"
                          />
                          <span className="text-sm font-medium leading-6 text-stone-700">{item.label}</span>
                        </label>
                      ))}
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={goNext} disabled={!allConsented}>
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-6">
                    <Surface>
                      <CalendarDays className="mb-4 h-6 w-6 text-rose-500" />
                      <h3 className="text-xl font-semibold text-stone-950">About your cycle</h3>
                      <p className="mt-2 text-sm text-stone-500">
                        These help us estimate your next cycle. Not medical advice — just estimates.
                      </p>

                      <div className="mt-6 space-y-5">
                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
                            When did your last period start?
                          </label>
                          <input
                            type="date"
                            value={survey.lastPeriod}
                            onChange={(e) => setSurvey((s) => ({ ...s, lastPeriod: e.target.value }))}
                            className="w-full rounded-2xl border border-white/75 bg-white/70 px-4 py-3 font-medium text-stone-950 outline-none transition-all focus:border-rose-200 focus:ring-2 focus:ring-rose-200/50"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
                            Typical cycle length
                          </label>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {['21-24 days', '25-28 days', '29-32 days', '33-35 days'].map((opt) => (
                              <button
                                key={opt}
                                onClick={() => setSurvey((s) => ({ ...s, cycleLength: opt }))}
                                className={cn(
                                  'rounded-2xl border px-4 py-3 text-sm font-semibold transition-all',
                                  survey.cycleLength === opt
                                    ? 'border-rose-300 bg-rose-50/60 text-rose-700'
                                    : 'border-white/70 bg-white/60 text-stone-600 hover:bg-white/80',
                                )}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
                            Flow intensity
                          </label>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {['Light', 'Moderate', 'Heavy', 'Variable'].map((opt) => (
                              <button
                                key={opt}
                                onClick={() => setSurvey((s) => ({ ...s, flowIntensity: opt.toLowerCase() }))}
                                className={cn(
                                  'rounded-2xl border px-4 py-3 text-sm font-semibold transition-all',
                                  survey.flowIntensity === opt.toLowerCase()
                                    ? 'border-rose-300 bg-rose-50/60 text-rose-700'
                                    : 'border-white/70 bg-white/60 text-stone-600 hover:bg-white/80',
                                )}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Surface>

                    <div className="flex justify-between">
                      <Button variant="ghost" onClick={goBack}>Back</Button>
                      <Button onClick={goNext} disabled={!canContinueSurvey}>
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <Surface>
                      <Sparkles className="mb-4 h-6 w-6 text-rose-500" />
                      <h3 className="text-xl font-semibold text-stone-950">Your preferences</h3>
                      <p className="mt-2 text-sm text-stone-500">
                        Pick what matters to you. These help curate your kit.
                      </p>

                      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {preferences.map((item) => {
                          const isSelected = selected.includes(item);
                          return (
                            <button
                              key={item}
                              onClick={() =>
                                setSelected((prev) =>
                                  prev.includes(item)
                                    ? prev.filter((s) => s !== item)
                                    : [...prev, item],
                                )
                              }
                              className={cn(
                                'flex items-center gap-3 rounded-2xl border p-4 text-left text-sm font-semibold transition-all',
                                isSelected
                                  ? 'border-rose-300 bg-rose-50/60 text-rose-700'
                                  : 'border-white/70 bg-white/60 text-stone-600 hover:bg-white/80',
                              )}
                            >
                              <span className={cn(
                                'grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors',
                                isSelected ? 'border-rose-500 bg-rose-500 text-white' : 'border-stone-300',
                              )}>
                                {isSelected && <Check className="h-3.5 w-3.5" />}
                              </span>
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </Surface>

                    <div className="flex justify-between">
                      <Button variant="ghost" onClick={goBack}>Back</Button>
                      <Button onClick={goNext}>
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <Surface>
                      <UserRound className="mb-4 h-6 w-6 text-rose-500" />
                      <h3 className="text-xl font-semibold text-stone-950">One last thing</h3>
                      <p className="mt-2 text-sm text-stone-500">
                        What should we call you?
                      </p>

                      <div className="mt-6">
                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
                          Your name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your name"
                          className="w-full rounded-2xl border border-white/75 bg-white/70 px-4 py-3 font-medium text-stone-950 outline-none transition-all focus:border-rose-200 focus:ring-2 focus:ring-rose-200/50"
                        />
                      </div>

                      <div className="mt-6 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 p-4">
                        <p className="text-sm font-medium text-emerald-800">
                          You're all set! We'll take you to your dashboard where you can explore your cycle,
                          build your kit, and learn more.
                        </p>
                      </div>
                    </Surface>

                    <div className="flex justify-between">
                      <Button variant="ghost" onClick={goBack}>Back</Button>
                      <Button onClick={save} disabled={saveOnboarding.isPending}>
                        {saveOnboarding.isPending ? 'Saving...' : 'Complete setup'}
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex justify-center gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-2 w-2 rounded-full transition-all duration-300',
                  i === step ? 'w-8 bg-stone-950' : 'bg-stone-300',
                )}
              />
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
