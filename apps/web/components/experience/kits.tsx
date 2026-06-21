'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, ArrowRight, Trash2, ExternalLink } from 'lucide-react';
import {
  Section,
  EmptyState,
  Surface,
  PageHeader,
  Skeleton,
  Badge,
} from '@/components/experience/primitives';
import { useKitTemplates } from '@/lib/queries';

export function KitsExperience() {
  const { data: kits, isLoading } = useKitTemplates();

  return (
    <>
      <PageHeader
        eyebrow="Your kits"
        title="Saved kits"
        copy="Browse, manage, and reorder your saved period kits."
        icon={<Package className="h-6 w-6" />}
      />
      <Section>
        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-40 rounded-3xl" count={3} />
          </div>
        ) : kits && kits.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {kits.map((kit) => (
              <motion.div
                key={kit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Surface hover>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-stone-950">
                        {kit.name}
                      </h3>
                      <p className="mt-1 text-sm text-stone-500">
                        {kit.items.length} {kit.items.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                    {kit.isActiveSource && (
                      <Badge className="bg-emerald-100 text-emerald-800">
                        Active
                      </Badge>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-stone-400">
                    <span>
                      Saved{' '}
                      {new Date(kit.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/kit-builder?kit=${kit.id}`}
                      className="flex items-center gap-1.5 rounded-full bg-stone-950 px-4 py-2 text-xs font-semibold text-white transition-transform hover:scale-[1.02]"
                    >
                      Open <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </Surface>
              </motion.div>
            ))}
          </div>
        ) : (
          <Surface>
            <EmptyState
              title="No kits yet"
              copy="Create your first period kit from the kit builder."
              icon={<Package className="h-8 w-8" />}
            />
          </Surface>
        )}
      </Section>
    </>
  );
}
