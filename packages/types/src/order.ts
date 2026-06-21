export type OrderStatus =
  | 'kit_confirmed'
  | 'payment_pending'
  | 'payment_completed'
  | 'inventory_check'
  | 'packing'
  | 'quality_check'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface Order {
  id: string;
  userId: string;
  subscriptionId?: string;
  status: OrderStatus;
  totalAmount: number;
  placedAt: Date;
  updatedAt: Date;
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
  status: OrderStatus;
  changedAt: Date;
  note?: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  carrier: string;
  trackingId: string;
  status: string;
  lastSyncedAt?: Date;
}

export interface Payment {
  id: string;
  orderId: string;
  provider: string;
  providerRef: string;
  amount: number;
  status: PaymentStatus;
  createdAt: Date;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
