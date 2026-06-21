'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ChevronRight } from 'lucide-react';
import {
  Section,
  EmptyState,
  Surface,
  Badge,
  PageHeader,
  Skeleton,
  PillNav,
} from '@/components/experience/primitives';
import { useProducts } from '@/lib/queries';
import { cn } from '@/lib/utils';

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Daily ease', value: 'Daily ease' },
  { label: 'Heavy flow', value: 'Heavy flow' },
  { label: 'Sensitive skin', value: 'Sensitive skin' },
  { label: 'Travel days', value: 'Travel days' },
];

export function DiscoverExperience() {
  const products = useProducts();
  const [mode, setMode] = useState('all');

  const visible = (products.data ?? []).filter(
    (p) => mode === 'all' || p.category?.name === mode,
  );

  return (
    <>
      <PageHeader
        eyebrow="Discover"
        title="Explore what works for you"
        copy="Browse products made for your body and your life — not a shop, a discovery space."
        icon={<Sparkles className="h-6 w-6" />}
      />
      <Section>
        <PillNav items={categories} value={mode} onChange={setMode} className="mb-8" />
        {products.isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-72 rounded-2xl" count={4} />
          </div>
        ) : visible.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {visible.map((product, index) => (
              <Surface key={product.id} delay={index * 0.03} className="group overflow-hidden p-0">
                <div className="h-44 bg-[radial-gradient(circle_at_35%_30%,rgba(251,113,133,0.35),transparent_32%),linear-gradient(135deg,#fff7ed,#ecfdf5)] transition-transform duration-500 group-hover:scale-105" />
                <div className="p-5">
                  <Badge variant="rose">
                    {typeof product.category === 'string'
                      ? product.category
                      : product.category?.name ?? 'Essential'}
                  </Badge>
                  <h3 className="mt-3 text-lg font-semibold leading-tight text-stone-950">
                    {product.name}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">
                    {product.description ?? 'Thoughtfully chosen for your wellness journey.'}
                  </p>
                  <Link
                    href={`/products/${product.id}`}
                    className="mt-5 inline-flex items-center text-sm font-semibold text-rose-600"
                  >
                    Explore <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </Surface>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nothing to explore yet"
            copy="Products will appear here once they are added to the collection."
          />
        )}
      </Section>
    </>
  );
}
