'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowRight, Check, ChevronRight, Heart, Plus, Sparkles, Wand2,
  Package, Leaf, RefreshCw, ShoppingBag, X, Star,
} from 'lucide-react';
import { useProducts, useSaveKit } from '@/lib/queries';
import type { Product, KitTemplate } from '@/lib/queries';
import Link from 'next/link';
import { useHerFlowsStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Section, EmptyState, Button, StepIndicator, Surface, Badge, AnimatedCounter } from './primitives';
import { useToastStore } from './toast';

const STEPS = ['Your Cycle', 'Products', 'Wellness', 'Delivery'];
const CYCLE_OPTIONS = ['Light', 'Moderate', 'Heavy', 'Variable'];
const CONCERN_OPTIONS = ['Cramps', 'Skin changes', 'Fatigue', 'Bloating', 'Mood shifts'];
const PREFERENCE_OPTIONS = ['Organic', 'Unscented', 'Vegan', 'Minimal packaging', 'TSA-friendly'];
const FREQUENCIES = [
  { value: 'monthly', label: 'Monthly', description: 'Delivered every 4 weeks' },
  { value: '6weeks', label: 'Every 6 weeks', description: 'More breathing room between shipments' },
  { value: '2months', label: 'Every 2 months', description: 'For lighter cycles or well-stocked routines' },
];
const EASE = [0.16, 1, 0.3, 1];

function getCat(product: Product): string {
  if (typeof product.category === 'string') return product.category;
  return product.category?.name ?? '';
}

function isEssential(product: Product): boolean {
  return /pad|tampon|cup|underwear|liner|disc|panty/i.test(getCat(product));
}
function isComfort(product: Product): boolean {
  return /heat|patch|tea|oil|supplement|cream|balm|wellness|relax|soothe|skincare|aromatherapy/i.test(getCat(product));
}

function varId(product: Product): string {
  return product.variants?.[0]?.id ?? product.id;
}

export function KitBuilderExperience() {
  const prefersReduced = useReducedMotion();
  const toast = useToastStore((s) => s.addToast);
  const {
    kitName, kitItems, setupStep,
    setKitName, addKitItem, updateKitItem, removeKitItem, setSetupStep,
  } = useHerFlowsStore();
  const { data: products = [], isLoading } = useProducts();
  const saveKit = useSaveKit();

  const [direction, setDirection] = useState(0);
  const [cycleType, setCycleType] = useState('');
  const [concerns, setConcerns] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [frequency, setFrequency] = useState('');
  const [showKit, setShowKit] = useState(false);
  const [savedKit, setSavedKit] = useState<KitTemplate | null>(null);

  const prevStepRef = useRef(setupStep);
  useEffect(() => {
    setDirection(setupStep > prevStepRef.current ? 1 : -1);
    prevStepRef.current = setupStep;
  }, [setupStep]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setupStep]);

  const essentialProducts = products.filter(isEssential);
  const comfortProducts = products.filter(isComfort);
  const uncategorized = products.filter((p) => !isEssential(p) && !isComfort(p));
  const step1Products = essentialProducts.length > 0 ? essentialProducts : products;
  const step2Products = comfortProducts.length > 0 ? comfortProducts : products;

  const totalItems = kitItems.reduce((s, i) => s + i.quantity, 0);

  const handleAdd = useCallback((product: Product) => {
    const id = varId(product);
    const role = isEssential(product) ? 'Essential' : isComfort(product) ? 'Comfort' : 'Essential';
    addKitItem({ id, name: product.name, quantity: 1, role });
    toast(`${product.name} added`);
  }, [addKitItem, toast]);

  const handleSave = useCallback(() => {
    saveKit.mutate(
      { name: kitName, items: kitItems.map((i) => ({ id: i.id, quantity: i.quantity })) },
      {
        onSuccess: (data) => {
          setSavedKit(data as KitTemplate);
          setShowKit(true);
        },
        onError: () => toast('Could not save kit'),
      },
    );
  }, [saveKit, kitName, kitItems, toast]);

  const toggleConcern = (item: string) => setConcerns((p) => p.includes(item) ? p.filter((c) => c !== item) : [...p, item]);
  const togglePreference = (item: string) => setPreferences((p) => p.includes(item) ? p.filter((c) => c !== item) : [...p, item]);

  const goNext = () => { if (setupStep < 3) setSetupStep(setupStep + 1); };
  const goBack = () => { if (setupStep > 0) setSetupStep(setupStep - 1); };

  const animateProps = prefersReduced ? {} : {
    variants: {
      enter: (dir: number) => ({ x: dir > 0 ? 320 : -320, opacity: 0 }),
      center: { x: 0, opacity: 1 },
      exit: (dir: number) => ({ x: dir > 0 ? -320 : 320, opacity: 0 }),
    },
    custom: direction,
    initial: 'enter',
    animate: 'center',
    exit: 'exit',
  };

  const productCard = (product: Product, role: string, idx: number) => {
    const added = kitItems.some((i) => i.id === varId(product));
    return (
      <motion.div
        key={product.id}
        initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: idx * 0.03, ease: EASE }}
        className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/62 p-4 shadow-card backdrop-blur-2xl transition-all hover:shadow-lg"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Badge variant={role === 'Comfort' ? 'lavender' : 'rose'}>
              {getCat(product) || role}
            </Badge>
            <h3 className="mt-2 text-base font-semibold leading-snug text-stone-950">{product.name}</h3>
            {product.description && (
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-stone-600">{product.description}</p>
            )}
            {product.price !== undefined && (
              <p className="mt-2 text-sm font-semibold text-stone-700">&#8377;{product.price}</p>
            )}
          </div>
          <button
            onClick={() => !added && handleAdd(product)}
            disabled={added}
            className={cn(
              'grid h-10 w-10 shrink-0 place-items-center rounded-full transition-all',
              added ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-950 text-white shadow-lg hover:bg-stone-800',
            )}
          >
            {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </button>
        </div>
      </motion.div>
    );
  };

  const renderStep = () => {
    switch (setupStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">Tell us about your cycle</p>
              <p className="mt-1 text-sm text-stone-500">
                These help us recommend products for you. You can change these anytime.
              </p>
              <p className="mt-5 mb-3 text-xs font-bold uppercase tracking-[0.2em] text-rose-500">Cycle type</p>
              <div className="flex flex-wrap gap-2">
                {CYCLE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setCycleType(opt)}
                    className={cn(
                      'rounded-full px-5 py-2.5 text-sm font-semibold transition-all',
                      cycleType === opt
                        ? 'bg-stone-950 text-white shadow-lg'
                        : 'bg-white/70 text-stone-600 hover:bg-white',
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-rose-500">Concerns</p>
              <div className="flex flex-wrap gap-2">
                {CONCERN_OPTIONS.map((opt) => {
                  const selected = concerns.includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleConcern(opt)}
                      className={cn(
                        'flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all',
                        selected
                          ? 'bg-rose-100 text-rose-700 ring-2 ring-rose-300/50'
                          : 'bg-white/70 text-stone-600 hover:bg-white',
                      )}
                    >
                      {selected && <Check className="h-3 w-3" />}
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-rose-500">Preferences</p>
              <div className="flex flex-wrap gap-2">
                {PREFERENCE_OPTIONS.map((opt) => {
                  const selected = preferences.includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => togglePreference(opt)}
                      className={cn(
                        'flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all',
                        selected
                          ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-300/50'
                          : 'bg-white/70 text-stone-600 hover:bg-white',
                      )}
                    >
                      {selected && <Check className="h-3 w-3" />}
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">Period care</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-950">Choose your products</h2>
              <p className="mt-1 text-sm text-stone-500">Pads, tampons, cups, liners, and more.</p>
            </div>
            {isLoading ? (
              <div className="grid gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/50" />
                ))}
              </div>
            ) : step1Products.length > 0 ? (
              <div className="grid gap-3">
                {step1Products.map((product, i) => productCard(product, 'Essential', i))}
              </div>
            ) : (
              <EmptyState title="No products yet" copy="Products will appear here when available." icon={<Package className="h-6 w-6" />} />
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">Wellness</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-950">Add comfort items</h2>
              <p className="mt-1 text-sm text-stone-500">Heat patches, teas, oils, and soothing products.</p>
            </div>
            {isLoading ? (
              <div className="grid gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/50" />
                ))}
              </div>
            ) : step2Products.length > 0 ? (
              <div className="grid gap-3">
                {step2Products.map((product, i) => productCard(product, 'Comfort', i))}
              </div>
            ) : (
              <EmptyState title="No comfort items yet" copy="Comfort products will appear here when available." icon={<Heart className="h-6 w-6" />} />
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">Delivery</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-950">How often?</h2>
              <p className="mt-1 text-sm text-stone-500">Choose your delivery frequency.</p>
            </div>
            <div className="grid gap-3">
              {FREQUENCIES.map((freq) => (
                <button
                  key={freq.value}
                  onClick={() => setFrequency(freq.value)}
                  className={cn(
                    'rounded-2xl border p-4 text-left transition-all',
                    frequency === freq.value
                      ? 'border-stone-950 bg-stone-950 text-white shadow-lg'
                      : 'border-white/70 bg-white/62 text-stone-700 hover:bg-white/80',
                  )}
                >
                  <span className={cn(
                    'inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]',
                    frequency === freq.value ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600',
                  )}>
                    {freq.label}
                  </span>
                  <p className="mt-2 text-sm leading-6 opacity-80">{freq.description}</p>
                </button>
              ))}
            </div>
            <Surface className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">Review</p>
              <div className="space-y-2">
                {cycleType && <SummaryRow icon={<Sparkles className="h-4 w-4 text-amber-500" />} label="Cycle" value={cycleType} />}
                {concerns.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-white/60 px-4 py-2.5 text-sm">
                    <span className="font-medium text-stone-500">Concerns:</span>
                    {concerns.map((c) => <Badge key={c} variant="rose">{c}</Badge>)}
                  </div>
                )}
                {preferences.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-white/60 px-4 py-2.5 text-sm">
                    <span className="font-medium text-stone-500">Preferences:</span>
                    {preferences.map((p) => <Badge key={p} variant="sage">{p}</Badge>)}
                  </div>
                )}
                {kitItems.length > 0 && <SummaryRow icon={<Package className="h-4 w-4 text-stone-500" />} label="Items" value={`${kitItems.length} in kit`} />}
                {frequency && <SummaryRow icon={<RefreshCw className="h-4 w-4 text-emerald-500" />} label="Delivery" value={FREQUENCIES.find((f) => f.value === frequency)?.label ?? ''} />}
              </div>
            </Surface>
          </div>
        );

      default:
        return null;
    }
  };

  function SummaryRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-white/60 px-4 py-2.5 text-sm">
        {icon}
        <span className="font-medium text-stone-500">{label}: <span className="font-semibold text-stone-950">{value}</span></span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Step indicator */}
      <div className="mb-6 overflow-x-auto scrollbar-hide">
        <StepIndicator steps={STEPS} current={setupStep} onStep={setSetupStep} />
      </div>

      {/* Kit name */}
      <div className="mb-6">
        <input
          value={kitName}
          onChange={(e) => setKitName(e.target.value)}
          className="w-full bg-transparent text-2xl font-semibold tracking-tight text-stone-950 outline-none placeholder:text-stone-300"
          placeholder="Name your kit"
        />
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={setupStep}
          transition={{ duration: 0.3, ease: EASE }}
          {...animateProps}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between border-t border-white/40 pt-6">
        {setupStep > 0 ? (
          <button onClick={goBack} className="inline-flex items-center gap-2 rounded-full bg-white/70 px-5 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:bg-white">
            <ChevronRight className="h-4 w-4 rotate-180" /> Back
          </button>
        ) : <div />}
        {setupStep < 3 ? (
          <button
            onClick={goNext}
            disabled={setupStep === 0 && !cycleType}
            className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-6 py-2.5 text-sm font-semibold text-white shadow-lg disabled:opacity-40"
          >
            Next <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={saveKit.isPending}
            className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-8 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-50"
          >
            {saveKit.isPending ? 'Saving...' : 'Save kit'}
          </button>
        )}
      </div>

      {/* Floating kit button on mobile */}
      {totalItems > 0 && !savedKit && (
        <button
          onClick={() => setShowKit(true)}
          className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full bg-stone-950 px-4 py-3 text-sm font-semibold text-white shadow-xl lg:hidden"
        >
          <ShoppingBag className="h-4 w-4" />
          <AnimatedCounter value={totalItems} />
        </button>
      )}

      {/* Full-page kit view on mobile */}
      <AnimatePresence>
        {showKit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/95 backdrop-blur-2xl lg:hidden"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="flex h-full flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/40 px-5 py-4">
                <h2 className="text-lg font-semibold text-stone-950">
                  {savedKit ? 'Kit saved!' : 'Your kit'}
                </h2>
                <button onClick={() => { setShowKit(false); setSavedKit(null); }} className="rounded-full p-2 hover:bg-white/60">
                  <X className="h-5 w-5 text-stone-500" />
                </button>
              </div>

              {savedKit ? (
                /* Success state */
                <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                  <div className="mb-6 grid h-20 w-20 place-items-center rounded-full bg-emerald-100">
                    <Check className="h-10 w-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-stone-950">{savedKit.name} saved</h3>
                  <p className="mt-2 text-stone-500">
                    Your kit has been saved. You can view it anytime from your kits page.
                  </p>
                  <div className="mt-8 flex w-full flex-col gap-3">
                    <Link
                      href="/kits"
                      onClick={() => { setShowKit(false); setSavedKit(null); }}
                      className="w-full rounded-full bg-stone-950 py-3 text-center text-sm font-semibold text-white shadow-lg"
                    >
                      View your kits
                    </Link>
                    <button
                      onClick={() => { setShowKit(false); setSavedKit(null); }}
                      className="w-full rounded-full bg-white/70 py-3 text-sm font-semibold text-stone-700 transition-colors hover:bg-white"
                    >
                      Continue editing
                    </button>
                  </div>
                </div>
              ) : (
                /* Kit items */
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
                    {kitName || 'Your kit'} · {totalItems} {totalItems === 1 ? 'item' : 'items'}
                  </p>
                  <div className="mt-4 space-y-2">
                    {kitItems.length === 0 ? (
                      <p className="py-6 text-center text-sm text-stone-400">Your kit is empty.</p>
                    ) : (
                      (['Essential', 'Comfort'] as const).map((role) => {
                        const group = kitItems.filter((i) => i.role === role);
                        if (group.length === 0) return null;
                        return (
                          <div key={role}>
                            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-stone-400">{role}</p>
                            {group.map((item) => (
                              <div key={item.id} className="mb-2 flex items-center justify-between rounded-xl border border-white/60 bg-white/70 px-4 py-3 shadow-sm">
                                <p className="min-w-0 flex-1 truncate text-sm font-semibold text-stone-950">{item.name}</p>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => updateKitItem(item.id, item.quantity - 1)}
                                    className="grid h-8 w-8 place-items-center rounded-full bg-stone-100 text-sm font-bold text-stone-700"
                                  >-</button>
                                  <span className="w-6 text-center text-base font-semibold text-stone-950">{item.quantity}</span>
                                  <button
                                    onClick={() => updateKitItem(item.id, item.quantity + 1)}
                                    className="grid h-8 w-8 place-items-center rounded-full bg-stone-950 text-sm font-bold text-white"
                                  >+</button>
                                  <button
                                    onClick={() => { removeKitItem(item.id); toast('Removed'); }}
                                    className="ml-2 text-xs font-semibold text-stone-400 hover:text-rose-600"
                                  >Remove</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* Bottom action */}
              {!savedKit && (
                <div className="border-t border-white/40 px-5 py-4">
                  <button
                    onClick={handleSave}
                    disabled={saveKit.isPending || kitItems.length === 0}
                    className="w-full rounded-full bg-stone-950 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-40"
                  >
                    {saveKit.isPending ? 'Saving...' : 'Save kit'}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for bottom nav on mobile */}
      <div className="h-24 lg:hidden" />

      {/* Desktop sidebar */}
      <aside className="fixed bottom-0 right-0 top-20 hidden w-80 border-l border-white/40 bg-white/50 p-6 backdrop-blur-2xl lg:block">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">Your kit</p>
        <AnimatedCounter value={totalItems} className="mt-1 text-2xl font-semibold text-stone-950" />

        <div className="mt-5 space-y-2">
          {kitItems.length === 0 ? (
            <p className="py-6 text-center text-sm text-stone-400">Your kit is empty.</p>
          ) : (
            (['Essential', 'Comfort'] as const).map((role) => {
              const group = kitItems.filter((i) => i.role === role);
              if (group.length === 0) return null;
              return (
                <div key={role}>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-stone-400">{role}</p>
                  {group.map((item) => (
                    <div key={item.id} className="mb-2 rounded-xl bg-white/70 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-stone-950">{item.name}</p>
                        <button
                          onClick={() => { removeKitItem(item.id); toast(`${item.name} removed`); }}
                          className="shrink-0 text-xs font-semibold text-stone-400 hover:text-rose-600"
                        >Remove</button>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => updateKitItem(item.id, item.quantity - 1)}
                          className="grid h-7 w-7 place-items-center rounded-full bg-stone-100 text-xs font-bold text-stone-700"
                        >-</button>
                        <AnimatedCounter value={item.quantity} className="w-6 text-center text-sm font-semibold text-stone-950" />
                        <button
                          onClick={() => updateKitItem(item.id, item.quantity + 1)}
                          className="grid h-7 w-7 place-items-center rounded-full bg-stone-950 text-xs font-bold text-white"
                        >+</button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>

        {kitItems.length > 0 && (
          <button
            onClick={handleSave}
            disabled={saveKit.isPending}
            className="mt-5 w-full rounded-full bg-stone-950 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saveKit.isPending ? 'Saving...' : 'Save kit'}
          </button>
        )}
      </aside>
    </div>
  );
}
