export interface User {
  id: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
}

export interface UserPreferences {
  id: string;
  userId: string;
  ageRange?: string;
  cycleLength?: string;
  flowIntensity?: string;
  skinSensitivity?: string;
  preferredMaterials: string[];
  sustainabilityPref?: string;
  travelFrequency?: string;
  budget?: string;
  subscriptionPref?: string;
  version: number;
  createdAt: Date;
}

export interface ConsentLog {
  id: string;
  userId: string;
  policyType: 'privacy_policy' | 'terms_and_conditions' | 'medical_disclaimer' | 'consent_policy' | 'data_processing' | 'cookie_policy' | 'marketing_emails';
  policyVersion: number;
  contentHash: string;
  ipAddress: string;
  userAgent: string;
  browser: string;
  country: string;
  language: string;
  acceptedAt: Date;
}

export interface PolicyDocument {
  id: string;
  type: string;
  version: number;
  content: string;
  publishedAt: Date;
}

export interface Product {
  id: string;
  brandId: string;
  categoryId: string;
  name: string;
  description: string;
  materials: string[];
  status: 'active' | 'inactive' | 'draft';
  averageRating: number;
  reviewCount: number;
  createdAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  attributes: Record<string, string>;
  price: number;
  stockQty: number;
}

export interface Subscription {
  id: string;
  userId: string;
  planType: 'one_time' | 'monthly' | 'quarterly' | 'yearly';
  status: 'active' | 'paused' | 'cancelled' | 'skipped_this_cycle';
  autoRenew: boolean;
  nextDispatchDate: Date;
  editLockDate: Date;
  kitTemplateId: string;
}

export interface KitTemplate {
  id: string;
  userId: string;
  name: string;
  isActiveSource: boolean;
  items?: KitTemplateItem[];
}

export interface KitTemplateItem {
  id: string;
  kitTemplateId: string;
  productVariantId: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  subscriptionId?: string;
  status: string;
  totalAmount: number;
  placedAt: Date;
  items?: OrderItem[];
  statusHistory?: OrderStatusHistory[];
  shipment?: Shipment;
  payment?: Payment;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productVariantId: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: string;
  changedAt: Date;
  note?: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  carrier: string;
  trackingId: string;
  status: string;
}

export interface Payment {
  id: string;
  orderId: string;
  provider: string;
  providerRef: string;
  amount: number;
  status: string;
}

export interface RewardTransaction {
  id: string;
  userId: string;
  type: 'earn' | 'redeem';
  source: string;
  amount: number;
  balanceAfter: number;
  createdAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  orderId: string;
  rating: number;
  text: string;
  photos: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface CycleEntry {
  id: string;
  userId: string;
  date: Date;
  flowLevel?: string;
  mood?: string;
  symptoms: string[];
  notes?: string;
}

export interface CycleEstimate {
  id: string;
  estimatedStartDate: Date;
  disclaimerText: string;
}

export interface ApiResponse<T = void> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string };
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  status: 'open' | 'pending' | 'resolved';
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  adminUserId: string;
  action: string;
  entity: string;
  entityId: string;
  at: Date;
}
