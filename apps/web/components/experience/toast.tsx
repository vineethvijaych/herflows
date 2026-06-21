'use client';

import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

type Toast = {
  id: string;
  message: string;
  type: 'success' | 'info';
};

type ToastStore = {
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'info') => void;
  removeToast: (id: string) => void;
};

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = 'success') => {
    const id = Math.random().toString(36).slice(2);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[100] mx-auto flex max-w-md flex-col items-center gap-2 px-4 md:bottom-8">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.92 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex w-full items-center gap-3 rounded-2xl border border-white/70 bg-white px-4 py-3 shadow-[0_20px_60px_rgba(45,35,28,0.18)] backdrop-blur-2xl"
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-100">
              <Check className="h-4 w-4 text-emerald-700" />
            </span>
            <p className="flex-1 text-sm font-semibold text-stone-800">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="shrink-0 rounded-full p-1 hover:bg-stone-100">
              <X className="h-4 w-4 text-stone-400" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
