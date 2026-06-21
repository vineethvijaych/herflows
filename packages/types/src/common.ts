export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = void> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface AuditLog {
  id: string;
  adminUserId: string;
  action: string;
  entity: string;
  entityId: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  at: Date;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  roleId: string;
  role?: Role;
}

export interface Role {
  id: string;
  name: string;
  permissions?: Permission[];
}

export interface Permission {
  id: string;
  roleId: string;
  module: string;
  action: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}
