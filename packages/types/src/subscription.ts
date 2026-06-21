export type PlanType = 'one_time' | 'monthly' | 'quarterly' | 'yearly';

export type SubscriptionStatus =
  | 'active'
  | 'paused'
  | 'cancelled'
  | 'skipped_this_cycle';

export interface Subscription {
  id: string;
  userId: string;
  planType: PlanType;
  status: SubscriptionStatus;
  autoRenew: boolean;
  nextDispatchDate: Date;
  editLockDate: Date;
  kitTemplateId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionEvent {
  id: string;
  subscriptionId: string;
  eventType: string;
  occurredAt: Date;
  actor: string;
}

export interface KitTemplate {
  id: string;
  userId: string;
  name: string;
  isActiveSource: boolean;
  createdAt: Date;
  updatedAt: Date;
  items?: KitTemplateItem[];
}

export interface KitTemplateItem {
  id: string;
  kitTemplateId: string;
  productVariantId: string;
  quantity: number;
  productVariant?: import('./product').ProductVariant;
}
