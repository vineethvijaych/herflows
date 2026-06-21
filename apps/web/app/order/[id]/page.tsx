'use client';

import Link from 'next/link';
import { ArrowLeft, PackageCheck } from 'lucide-react';
import { useOrder } from '@/lib/queries';
import { Section, Surface } from '@/components/experience/primitives';
import { formatShortDate } from '@/lib/utils';

export default function Page({ params }: { params: { id: string } }) {
  const { data: order, isLoading } = useOrder(params.id);

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
      <Link href="/orders" className="mb-6 inline-flex items-center text-sm font-semibold text-stone-500 hover:text-stone-950">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Link>
      <Surface>
        <PackageCheck className="mb-6 h-7 w-7 text-emerald-600" />
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-rose-500">Order detail</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950">Order {order?.id ?? params.id}</h1>
        {order ? (
          <div className="mt-5 space-y-2 text-lg leading-8 text-stone-600">
            <p>Status: <span className="font-semibold text-stone-950">{order.status}</span></p>
            {order.shipment?.status && <p>Shipment: {order.shipment.status}</p>}
            {order.shipment?.trackingId && <p>Tracking: {order.shipment.trackingId}</p>}
            {order.totalAmount && <p>Total: ₹{Number(order.totalAmount)}</p>}
          </div>
        ) : (
          <p className="mt-5 text-lg leading-8 text-stone-600">Order not found.</p>
        )}
      </Surface>
    </Section>
  );
}
