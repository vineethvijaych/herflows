'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminApi } from './api';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: { id: string; name: string; permissions: { module: string; action: string }[] };
}

interface AuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  admin: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      adminApi.get<{ admin: AdminUser }>('/admin/auth/profile')
        .then((res: any) => setAdmin(res.admin ?? res))
        .catch(() => {
          localStorage.removeItem('adminToken');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function login(email: string, password: string) {
    const data = await adminApi.post<{ accessToken: string; admin: AdminUser }>('/admin/auth/login', { email, password });
    localStorage.setItem('adminToken', data.accessToken);
    setAdmin(data.admin);
  }

  function logout() {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
