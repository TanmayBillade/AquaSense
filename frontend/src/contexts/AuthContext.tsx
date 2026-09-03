import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  device: { name: string; location: string; deviceId: string; };
  settings: {
    tdsThreshold: number;
    samplingInterval: number;
    notifications: { tdsAlert: boolean; filterAlert: boolean; connectionAlert: boolean; };
    units: string;
    theme: string;
  };
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          // Validate the token by fetching the user profile
          try {
            const res = await api.get('/auth/profile');
            if (res.data.success && res.data.user) {
              setUser(res.data.user);
            } else {
              // Token is invalid, clear it
              await AsyncStorage.removeItem('token');
              setToken(null);
            }
          } catch {
            // Token expired or invalid
            await AsyncStorage.removeItem('token');
            setToken(null);
          }
        }
      } catch (e) {
        console.error('Failed to load token', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: jwt, user: userData } = res.data;
      await AsyncStorage.setItem('token', jwt);
      setToken(jwt);
      setUser(userData);
    } else {
      throw new Error(res.data.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post('/auth/register', { name, email, password });
    if (res.data.success) {
      const { token: jwt, user: userData } = res.data;
      await AsyncStorage.setItem('token', jwt);
      setToken(jwt);
      setUser(userData);
    } else {
      throw new Error(res.data.message || 'Registration failed');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    await api.post('/auth/forgot-password', { email });
  };

  const updateProfile = async (data: Partial<User>) => {
    const res = await api.put('/auth/profile', data);
    if (res.data.success && res.data.user) {
      setUser(res.data.user);
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, isAuthenticated: !!token, login, register, logout, forgotPassword, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
