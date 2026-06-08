"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

export interface User {
  id: number;
  email: string;
  role_id: number;
  role_name?: string;
  patient_id?: number | null;
  full_name?: string;
  phone_number?: string | null;
  gender?: string | null;
  date_of_birth?: string | null;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, confirmPassword: string) => Promise<any>;
  loginWithGoogle: (idToken: string) => Promise<any>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<any>;
  changePassword: (data: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper functions for cookies
function setCookie(name: string, value: string, days = 7) {
  if (typeof window === 'undefined') return;
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Restore session on mount
    const savedToken = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        setAccessToken(savedToken);
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        
        // Ensure cookies match localStorage (e.g. if cookies were cleared but localStorage remains)
        setCookie('token', savedToken, 7);
        
        let roleString = 'PATIENT';
        if (parsedUser.role_id === 1 || parsedUser.role_name === 'ADMIN') roleString = 'ADMIN';
        else if (parsedUser.role_id === 3 || parsedUser.role_name === 'DOCTOR') roleString = 'DOCTOR';
        setCookie('userRole', roleString, 7);
      } catch (e) {
        console.error("Lỗi phục hồi phiên đăng nhập:", e);
        clearSession();
      }
    }
    setLoading(false);
  }, []);

  const clearSession = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    deleteCookie('token');
    deleteCookie('userRole');
  };

  const handleAuthSuccess = (res: any) => {
    if (res.success && res.accessToken) {
      const token = res.accessToken;
      const userData = res.user;

      setAccessToken(token);
      setUser(userData);

      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Set cookies for Next.js Edge Middleware route guards
      setCookie('token', token, 7);
      
      let roleString = 'PATIENT';
      if (userData.role_id === 1 || userData.role_name === 'ADMIN') roleString = 'ADMIN';
      else if (userData.role_id === 3 || userData.role_name === 'DOCTOR') roleString = 'DOCTOR';
      setCookie('userRole', roleString, 7);

      // Redirect based on role or stored redirect path
      const savedRedirect = typeof window !== 'undefined' ? localStorage.getItem('authRedirectPath') : null;
      if (savedRedirect) {
        localStorage.removeItem('authRedirectPath');
        router.push(savedRedirect);
      } else {
        if (roleString === 'DOCTOR') {
          router.push('/dashboard/doctor/patients');
        } else if (roleString === 'ADMIN') {
          router.push('/dashboard/admin/users');
        } else {
          router.push('/dashboard/patient');
        }
      }
    }
    return res;
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await authService.login({ email, password }) as any;
      return handleAuthSuccess(res);
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, confirmPassword: string) => {
    try {
      const res = await authService.register({ email, password, confirmPassword }) as any;
      return handleAuthSuccess(res);
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    try {
      const res = await authService.googleLogin(idToken) as any;
      return handleAuthSuccess(res);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const activeDevice = typeof window !== 'undefined' ? localStorage.getItem('activeDeviceId') : null;
      if (activeDevice) {
        const { deviceService } = await import('@/services/deviceService');
        await deviceService.endSession(activeDevice).catch((e) => console.warn("Lỗi giải phóng thiết bị khi logout:", e));
        if (typeof window !== 'undefined') {
          localStorage.removeItem('activeDeviceId');
        }
      }
      await authService.logout().catch((e) => console.warn("Lỗi đăng xuất từ backend:", e));
    } finally {
      clearSession();
      router.push('/auth');
    }
  };

  const updateProfile = async (data: any) => {
    try {
      const res = await authService.updateProfile(data) as any;
      if (res.success && res.user) {
        const updatedUser = { ...user, ...res.user };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      return res;
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (data: any) => {
    try {
      const res = await authService.changePassword(data) as any;
      return res;
    } catch (error) {
      throw error;
    }
  };

  // Ping mechanism for online status tracking
  useEffect(() => {
    if (!user || !accessToken) return;

    const performPing = async () => {
      try {
        await authService.ping();
      } catch (error) {
        console.warn("Lỗi ping trạng thái trực tuyến:", error);
      }
    };

    // Initial ping on session load
    performPing();

    // Ping every 3 minutes
    const interval = setInterval(performPing, 3 * 60 * 1000);

    // Ping immediately when user switches back to this tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        performPing();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user?.id, accessToken]);

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, register, loginWithGoogle, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
