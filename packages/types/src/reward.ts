export type RewardTransactionType = 'earn' | 'redeem';

export type RewardSource =
  | 'subscription'
  | 'review'
  | 'profile_completion'
  | 'referral'
  | 'purchase'
  | 'birthday'
  | 'campaign';

export interface RewardTransaction {
  id: string;
  userId: string;
  type: RewardTransactionType;
  source: RewardSource;
  amount: number;
  balanceAfter: number;
  createdAt: Date;
}

export interface Referral {
  id: string;
  referrerUserId: string;
  refereeUserId: string;
  code: string;
  status: ReferralStatus;
  rewardedAt?: Date;
  createdAt: Date;
}

export type ReferralStatus =
  | 'invited'
  | 'signed_up'
  | 'first_order_completed'
  | 'rewarded';
