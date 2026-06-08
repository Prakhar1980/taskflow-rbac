import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, LoginValues, RegisterValues } from '../api/auth';
import { User } from '../api/client';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login(values: LoginValues): Promise<void>;
  register(values: RegisterValues): Promise<void>;
  logout(): Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await authApi.me();
        localStorage.setItem('user', JSON.stringify(currentUser));
        setUser(currentUser);
      } catch {
        localStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    hydrate();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async login(values) {
        const result = await authApi.login(values);
        localStorage.setItem('accessToken', result.accessToken);
        localStorage.setItem('refreshToken', result.refreshToken);
        localStorage.setItem('user', JSON.stringify(result.user));
        setUser(result.user);
      },
      async register(values) {
        const result = await authApi.register(values);
        localStorage.setItem('accessToken', result.accessToken);
        localStorage.setItem('refreshToken', result.refreshToken);
        localStorage.setItem('user', JSON.stringify(result.user));
        setUser(result.user);
      },
      async logout() {
        try {
          await authApi.logout();
        } finally {
          localStorage.clear();
          setUser(null);
        }
      }
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
