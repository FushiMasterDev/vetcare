'use client';
export const dynamic = 'force-dynamic';
import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useAuthStore } from '@/lib/store';
import { Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function OAuth2RedirectPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const refreshToken = urlParams.get("refreshToken");
    if (token && refreshToken) {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      // Fetch user profile
      api.get('/v1/users/me').then(res => {
        setAuth({ accessToken: token, refreshToken, tokenType: 'Bearer', userId: res.data.id, email: res.data.email, fullName: res.data.fullName, avatarUrl: res.data.avatarUrl, role: res.data.role });
        router.push('/');
      }).catch(() => router.push('/login'));
    } else {
      router.push('/login');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600 mx-auto mb-3" />
        <p className="text-gray-500">Đang xử lý đăng nhập...</p>
      </div>
    </div>
  );
}
