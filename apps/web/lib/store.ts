'use client';

import { create } from 'zustand';

type KitItem = {
  id: string;
  name: string;
  quantity: number;
  role: string;
};

type HerFlowsStore = {
  kitName: string;
  kitItems: KitItem[];
  setupStep: number;
  token: string | null;
  isAuthenticated: boolean;
  setKitName: (kitName: string) => void;
  addKitItem: (item: KitItem) => void;
  updateKitItem: (id: string, quantity: number) => void;
  removeKitItem: (id: string) => void;
  setSetupStep: (step: number) => void;
  setAuth: (token: string | null) => void;
  logout: () => void;
};

export const useHerFlowsStore = create<HerFlowsStore>((set) => ({
  kitName: 'My monthly kit',
  kitItems: [],
  setupStep: 0,
  token: null,
  isAuthenticated: false,

  setKitName: (kitName) => set({ kitName }),
  addKitItem: (item) =>
    set((state) => ({
      kitItems: state.kitItems.some((existing) => existing.id === item.id)
        ? state.kitItems
        : [...state.kitItems, item],
    })),
  updateKitItem: (id, quantity) =>
    set((state) => ({
      kitItems: state.kitItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
      ),
    })),
  removeKitItem: (id) =>
    set((state) => ({
      kitItems: state.kitItems.filter((item) => item.id !== id),
    })),
  setSetupStep: (setupStep) => set({ setupStep }),

  setAuth: (token) => {
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    set({ token, isAuthenticated: !!token });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ token: null, isAuthenticated: false });
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  },
}));
