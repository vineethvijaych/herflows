'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, apiPatch, apiPost } from '@/lib/api';

export type ApiList<T> = T[] | { data?: T[]; items?: T[]; products?: T[]; articles?: T[] };

export type UserProfile = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  rewardPoints?: number;
};

export type CycleEntry = {
  id?: string;
  date: string;
  flowLevel?: string | number;
  mood?: string;
  symptoms?: string[];
  notes?: string;
};

export type CycleEstimate = {
  estimatedStartDate?: string;
  nextPeriodDate?: string;
  confidence?: string;
  basis?: string;
};

export type Product = {
  id: string;
  name: string;
  brand?: { id: string; name: string; description?: string };
  brandId?: string;
  category?: { id: string; name: string; parentId?: string; sustainabilityTag?: string };
  categoryId?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
  sustainability?: string;
  variants?: { id: string; name?: string; price?: number; stock?: number; sku?: string }[];
};

export type Article = {
  id?: string;
  title: string;
  slug?: string;
  category?: string;
  excerpt?: string;
  summary?: string;
  imageUrl?: string;
  content?: string;
  publishedAt?: string;
};

export type Subscription = {
  id: string;
  status?: string;
  planType?: string;
  nextBillingDate?: string;
  nextShipmentDate?: string;
  renewalDate?: string;
};

export type Order = {
  id: string;
  status?: string;
  placedAt?: string;
  totalAmount?: number;
  estimatedDelivery?: string;
  trackingNumber?: string;
  shipment?: { carrier?: string; trackingId?: string; status?: string };
  statusHistory?: { status: string; changedAt: string; note?: string }[];
};

function toArray<T>(value: ApiList<T> | undefined): T[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value.data ?? value.items ?? value.products ?? value.articles ?? [];
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get<UserProfile>('/users/me'),
  });
}

export function useCycleEntries() {
  return useQuery({
    queryKey: ['cycle-entries'],
    queryFn: async () => toArray<CycleEntry>(await api.get<ApiList<CycleEntry>>('/cycle/entries')),
  });
}

export function useCycleEstimate() {
  return useQuery({
    queryKey: ['cycle-estimate'],
    queryFn: () => api.get<CycleEstimate>('/cycle/estimate'),
  });
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => toArray<Product>(await api.get<ApiList<Product>>('/products?limit=24')),
  });
}

export function useArticles() {
  return useQuery({
    queryKey: ['articles'],
    queryFn: async () => toArray<Article>(await api.get<ApiList<Article>>('/education/articles')),
  });
}

export function useSubscriptions() {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => toArray<Subscription>(await api.get<ApiList<Subscription>>('/subscriptions')),
  });
}

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => toArray<Order>(await api.get<ApiList<Order>>('/orders')),
  });
}

export function useRewards() {
  return useQuery({
    queryKey: ['rewards'],
    queryFn: () => api.get<{ points?: number; balance?: number; level?: string }>('/rewards/balance'),
  });
}

export function useCreateCycleEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CycleEntry) => api.post('/cycle/entries', body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cycle-entries'] });
      void queryClient.invalidateQueries({ queryKey: ['cycle-estimate'] });
    },
  });
}

export function useDeleteCycleEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/cycle/entries/${id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cycle-entries'] });
      void queryClient.invalidateQueries({ queryKey: ['cycle-estimate'] });
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get<Product>(`/products/${id}`),
    enabled: !!id,
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: () => api.get<Article>(`/education/articles/${slug}`),
    enabled: !!slug,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get<Order>(`/orders/${id}`),
    enabled: !!id,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<UserProfile>) => api.patch('/users/me', body),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'pause' | 'resume' | 'skip' | 'renew' }) => {
      const endpoint = action === 'skip' ? `/subscriptions/${id}/skip-next` : `/subscriptions/${id}/${action}`;
      return action === 'renew' ? apiPost(endpoint) : apiPatch(endpoint);
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['subscriptions'] }),
  });
}

export type KitTemplate = {
  id: string;
  name: string;
  isActiveSource?: boolean;
  createdAt: string;
  items: { id: string; productVariantId: string; quantity: number }[];
};

export function useKitTemplates() {
  return useQuery({
    queryKey: ['kit-templates'],
    queryFn: () => api.get<KitTemplate[]>('/kit-templates'),
  });
}

export function useSaveKit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; items: { id: string; quantity: number }[] }) =>
      api.post('/kit-templates', {
        name: body.name,
        items: body.items.map((item) => ({ productVariantId: item.id, quantity: item.quantity })),
      }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['kit-templates'] }),
  });
}

export function useSaveOnboarding() {
  return useMutation({
    mutationFn: (body: { preferences: string[] }) => api.post('/onboarding/preferences', body),
  });
}

export function useWishlist() {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: () => api.get<{ id: string; variant: { id: string; product: { id: string; name: string; description?: string } } }[]>('/wishlist'),
  });
}

export function useReferralCode() {
  return useQuery({
    queryKey: ['referral-code'],
    queryFn: () => api.get<{ code: string }>('/referrals/my-code'),
  });
}

export function useReferralStatus() {
  return useQuery({
    queryKey: ['referral-status'],
    queryFn: () => api.get<{ total: number; rewarded: number; pending: number; referrals: unknown[] }>('/referrals/status'),
  });
}

export function useTickets() {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const data = await api.get<unknown[]>('/support/tickets');
      return data as { id: string; subject: string; status: string; createdAt: string }[];
    },
  });
}
