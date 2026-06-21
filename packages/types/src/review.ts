export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: string;
  userId: string;
  productId: string;
  orderId: string;
  rating: number;
  text: string;
  photos: string[];
  status: ReviewStatus;
  createdAt: Date;
}
