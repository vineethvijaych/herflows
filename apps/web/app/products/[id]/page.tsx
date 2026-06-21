'use client';

import Link from 'next/link';
import { ArrowLeft, Heart, Plus, Sparkles } from 'lucide-react';
import { useProduct } from '@/lib/queries';
import { Section, Surface } from '@/components/experience/primitives';
import { useToastStore } from '@/components/experience/toast';
import { useHerFlowsStore } from '@/lib/store';

export default function Page({ params }: { params: { id: string } }) {
  const { data: product, isLoading } = useProduct(params.id);
  const addKitItem = useHerFlowsStore((s) => s.addKitItem);
  const toast = useToastStore((s) => s.addToast);

  if (isLoading) {
    return (
      <Section className="pt-10">
        <div className="mx-auto max-w-4xl">
          <div className="h-80 animate-pulse rounded-[1.75rem] bg-white/50" />
        </div>
      </Section>
    );
  }

  if (!product) {
    return (
      <Section className="pt-10">
        <p className="text-center text-stone-500">Product not found.</p>
      </Section>
    );
  }

  return (
    <Section className="pt-10">
      <Link href="/products" className="mb-6 inline-flex items-center text-sm font-semibold text-stone-500 hover:text-stone-950">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Shop
      </Link>
      <Surface className="overflow-hidden p-0">
        <div className="grid gap-8 p-6 md:grid-cols-[0.9fr_1.1fr] md:p-10">
          <div className="min-h-80 rounded-2xl bg-[radial-gradient(circle_at_35%_30%,rgba(251,113,133,0.36),transparent_32%),radial-gradient(circle_at_70%_70%,rgba(16,185,129,0.26),transparent_30%),linear-gradient(135deg,#fff7ed,#f8fafc)]" />
          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-rose-500">{typeof product.category === 'string' ? product.category : product.category?.name ?? 'Essential'}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950">{product.name}</h1>
            {product.brand && <p className="mt-1 text-sm text-stone-500">{typeof product.brand === 'string' ? product.brand : product.brand?.name}</p>}
            <p className="mt-4 leading-8 text-stone-600">{product.description ?? 'No description available.'}</p>
            {product.variants?.[0]?.price && <p className="mt-4 text-2xl font-semibold text-stone-950">₹{product.variants[0].price}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => { addKitItem({ id: product.id, name: product.name, quantity: 1, role: product.category?.name ?? 'Essential' }); toast('Added to kit'); }}
                className="inline-flex min-h-11 items-center rounded-full bg-stone-950 px-5 text-sm font-semibold text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add to kit
              </button>
              <button className="inline-flex min-h-11 items-center rounded-full bg-white/70 px-5 text-sm font-semibold text-stone-700">
                <Heart className="mr-2 h-4 w-4" />
                Save
              </button>
            </div>
          </div>
        </div>
      </Surface>
    </Section>
  );
}
