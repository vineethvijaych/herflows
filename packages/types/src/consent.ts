export type PolicyType =
  | 'privacy_policy'
  | 'terms_and_conditions'
  | 'medical_disclaimer'
  | 'consent_policy'
  | 'data_processing'
  | 'cookie_policy'
  | 'marketing_emails';

export interface ConsentLog {
  id: string;
  userId: string;
  policyType: PolicyType;
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
  type: PolicyType;
  version: number;
  content: string;
  publishedAt: Date;
}

export interface ConsentRequest {
  policyType: PolicyType;
  accepted: boolean;
}
