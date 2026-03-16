// src/lib/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthResponse, User } from '@/types';

interface AuthState {
  user: Partial<User> | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (auth: AuthResponse) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (auth: AuthResponse) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', auth.accessToken);
          localStorage.setItem('refreshToken', auth.refreshToken);
        }
        set({
          user: {
            id: auth.userId,
            email: auth.email,
            fullName: auth.fullName,
            avatarUrl: auth.avatarUrl,
            role: auth.role,
          },
          accessToken: auth.accessToken,
          refreshToken: auth.refreshToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },

      updateUser: (updatedUser: Partial<User>) =>
        set((state) => ({ user: { ...state.user, ...updatedUser } })),
    }),
    {
      name: 'vetcare-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
