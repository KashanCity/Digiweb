import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { AppUser } from '@/types';
import { getCurrentUser, loginUser, logoutUser, registerUser, type RegisterInput } from '@/services/authService';

interface AuthContextValue {
  user: AppUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function refreshUser() {
    const current = await getCurrentUser();
    setUser(current);
  }

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, []);

  async function login(email: string, password: string) {
    await loginUser(email, password);
    await refreshUser();
  }

  async function register(input: RegisterInput) {
    const newUser = await registerUser(input);
    setUser(newUser);
  }

  async function logout() {
    await logoutUser();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth باید داخل AuthProvider استفاده شود');
  return ctx;
}
