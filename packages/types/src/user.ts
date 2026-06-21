export interface User {
  id: string;
  email: string;
  phone: string | null;
  passwordHash: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface UserPreferences {
  id: string;
  userId: string;
  ageRange: string | null;
  cycleLength: string | null;
  flowIntensity: string | null;
  skinSensitivity: string | null;
  preferredMaterials: string[];
  sustainabilityPref: string | null;
  travelFrequency: string | null;
  budget: string | null;
  subscriptionPref: string | null;
  version: number;
  createdAt: Date;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  marketingEmails: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
  };
}
