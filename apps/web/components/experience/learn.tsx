'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight } from 'lucide-react';
import {
  Section,
  EmptyState,
  Surface,
  Badge,
  PageHeader,
  Skeleton,
} from '@/components/experience/primitives';
import { useArticles } from '@/lib/queries';

export function LearnExperience() {
  const articles = useArticles();
  const list = articles.data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Learn"
        title="Learn about your body"
        copy="Clear, thoughtful articles you can read at your own pace. Not medical advice."
        icon={<BookOpen className="h-6 w-6" />}
      />
      <Section>
        {articles.isLoading ? (
          <div className="grid gap-5 md:grid-cols-3">
            <Skeleton className="h-72 rounded-3xl" count={3} />
          </div>
        ) : list.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-3">
            {list.slice(0, 9).map((article, index) => (
              <Surface
                key={article.slug ?? article.id ?? article.title}
                delay={index * 0.03}
                className={index === 0 ? 'md:col-span-2 md:row-span-2' : ''}
              >
                <div
                  className={
                    index === 0
                      ? 'mb-5 h-60 rounded-[1.25rem] bg-[radial-gradient(circle_at_25%_30%,rgba(251,113,133,0.42),transparent_34%),linear-gradient(135deg,#fff7ed,#f0fdf4)]'
                      : 'mb-5 h-40 rounded-[1.25rem] bg-[radial-gradient(circle_at_25%_30%,rgba(251,113,133,0.42),transparent_34%),linear-gradient(135deg,#fff7ed,#f0fdf4)]'
                  }
                />
                <Badge variant="rose">{article.category ?? 'Education'}</Badge>
                <h3 className="mt-3 text-xl font-semibold leading-tight text-stone-950">
                  {article.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">
                  {article.excerpt ?? article.summary ?? 'Wellness education.'}
                </p>
                <Link
                  href={`/education/${article.slug ?? ''}`}
                  className="mt-5 inline-flex items-center text-sm font-semibold text-rose-600"
                >
                  Read <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Surface>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Articles coming soon"
            copy="The learn section is ready for content. Check back for new articles."
          />
        )}
      </Section>
    </>
  );
}
