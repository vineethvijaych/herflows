'use client';

import { motion } from 'framer-motion';
import { Truck } from 'lucide-react';
import {
  Section,
  EmptyState,
  Surface,
  PageHeader,
  Skeleton,
} from '@/components/experience/primitives';
import { useOrders } from '@/lib/queries';
import { cn } from '@/lib/utils';

const steps = ['Preparing', 'Packed', 'In transit', 'Delivered'];

export function JourneyExperience() {
  const orders = useOrders();
  const current = orders.data?.[0];
  const currentStep = current?.status
    ? steps.findIndex(
        (s) => s.toLowerCase() === current.status?.toLowerCase(),
      )
    : -1;

  return (
    <>
      <PageHeader
        eyebrow="Journey"
        title="Track your shipment"
        copy="See where your package is and what is coming next."
        icon={<Truck className="h-6 w-6" />}
      />
      <Section>
        {orders.isLoading ? (
          <Skeleton className="h-56 rounded-3xl" />
        ) : current ? (
          <Surface>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">
                  Latest shipment
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-stone-950">
                  {current.status ?? 'Order placed'}
                </h2>
                {current.estimatedDelivery && (
                  <p className="mt-3 leading-7 text-stone-600">
                    Estimated delivery:{' '}
                    {new Date(current.estimatedDelivery).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                )}
              </div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-3"
              >
                {steps.map((step, index) => {
                  const completed = index <= currentStep;
                  return (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.08 }}
                      className="flex items-center gap-4 rounded-[1.25rem] bg-white/58 p-4"
                    >
                      <span
                        className={cn(
                          'grid h-10 w-10 place-items-center rounded-full font-semibold',
                          completed
                            ? 'bg-stone-950 text-white'
                            : 'bg-stone-100 text-stone-500',
                        )}
                      >
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-stone-950">{step}</p>
                        <p className="text-sm text-stone-500">
                          {completed ? 'Done' : 'Coming up'}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </Surface>
        ) : (
          <Surface>
            <EmptyState
              title="No orders yet"
              copy="Your shipment history will appear here once you place your first order."
            />
          </Surface>
        )}
      </Section>
    </>
  );
}
