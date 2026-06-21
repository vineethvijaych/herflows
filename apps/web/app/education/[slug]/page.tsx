'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useArticle } from '@/lib/queries';
import { Section, Surface } from '@/components/experience/primitives';

export default function Page({ params }: { params: { slug: string } }) {
  const { data: article, isLoading } = useArticle(params.slug);

  if (isLoading) {
    return (
      <Section className="pt-10">
        <div className="mx-auto max-w-4xl">
          <div className="h-64 animate-pulse rounded-[1.75rem] bg-white/50" />
        </div>
      </Section>
    );
  }

  return (
    <Section className="pt-10">
      <Link href="/education" className="mb-6 inline-flex items-center text-sm font-semibold text-stone-500 hover:text-stone-950">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Learn
      </Link>
      <Surface className="mx-auto max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-rose-500">{article?.category ?? 'Education'}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950">{article?.title ?? params.slug.replaceAll('-', ' ')}</h1>
        <div className="mt-5 text-lg leading-8 text-stone-600">
          {article?.content ? (
            <div className="whitespace-pre-line text-lg leading-8">{article.content}</div>
          ) : (
            <p>{article?.excerpt || 'A calm reading space for health education. Content is informational and never a diagnosis.'}</p>
          )}
        </div>
      </Surface>
    </Section>
  );
}
