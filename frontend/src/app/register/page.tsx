'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { PawPrint, Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

const schema = z.object({
  fullName: z.string().min(2, 'Tên tối thiểu 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, { message: 'Mật khẩu không khớp', path: ['confirmPassword'] });
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await authApi.register({ email: data.email, password: data.password, fullName: data.fullName, phone: data.phone });
      setAuth(res.data);
      toast.success('Đăng ký thành công! Chào mừng bạn đến với VetCare!');
      router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 font-bold text-2xl text-green-700">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
              <PawPrint className="w-6 h-6 text-white" />
            </div>
            VetCare
          </Link>
          <p className="text-gray-500 mt-2">Tạo tài khoản mới</p>
        </div>

        <div className="card p-8">
          <button onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/google`}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 px-4 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 mb-6">
            <img src="https://www.google.com/favicon.ico" alt="" className="w-5 h-5" />
            Đăng ký với Google
          </button>

          <div className="relative flex items-center mb-6">
            <div className="flex-1 border-t border-gray-200" />
            <span className="px-3 text-xs text-gray-400">hoặc đăng ký với email</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Họ và tên</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input {...register('fullName')} placeholder="Nguyễn Văn A" className="input pl-11" />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input {...register('email')} type="email" placeholder="email@example.com" className="input pl-11" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Số điện thoại <span className="text-gray-400 font-normal">(tuỳ chọn)</span></label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input {...register('phone')} placeholder="0901234567" className="input pl-11" />
              </div>
            </div>

            <div>
              <label className="label">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder="••••••••" className="input pl-11 pr-11" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="label">Xác nhận mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input {...register('confirmPassword')} type={showPw ? 'text' : 'password'} placeholder="••••••••" className="input pl-11" />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? 'Đang đăng ký...' : 'Tạo tài khoản'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-green-600 font-medium hover:underline">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
