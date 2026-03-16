'use client';
import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import MainLayout from '@/components/layout/MainLayout';
import Link from 'next/link';
import { User, Calendar, Settings, Camera, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: user?.fullName || '', phone: user?.phone || '', address: user?.address || '' });

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.patch(`/v1/users/${user?.id}`, form);
      updateUser(res.data);
      toast.success('Cập nhật thành công!');
      setEditing(false);
    } catch { toast.error('Cập nhật thất bại'); }
    finally { setLoading(false); }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Hồ sơ cá nhân</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-2">
            {[
              { href: '/profile', icon: User, label: 'Hồ sơ' },
              { href: '/profile/appointments', icon: Calendar, label: 'Lịch hẹn' },
            ].map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                <Icon className="w-4 h-4" /> {label}
              </Link>
            ))}
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <div className="card p-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-2xl font-bold text-primary-600">
                    {user?.fullName?.[0]?.toUpperCase()}
                  </div>
                  <button className="absolute bottom-0 right-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                    <Camera className="w-3 h-3 text-white" />
                  </button>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user?.fullName}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <span className="badge bg-primary-100 text-primary-700 mt-1">{user?.role}</span>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Họ và tên', field: 'fullName', type: 'text' },
                  { label: 'Số điện thoại', field: 'phone', type: 'tel' },
                  { label: 'Địa chỉ', field: 'address', type: 'text' },
                ].map(({ label, field, type }) => (
                  <div key={field}>
                    <label className="label">{label}</label>
                    {editing ? (
                      <input type={type} className="input" value={(form as any)[field]}
                        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} />
                    ) : (
                      <p className="text-gray-700 py-2.5 px-4 bg-gray-50 rounded-xl text-sm">
                        {(form as any)[field] || <span className="text-gray-400">Chưa cập nhật</span>}
                      </p>
                    )}
                  </div>
                ))}
                <div>
                  <label className="label">Email</label>
                  <p className="text-gray-700 py-2.5 px-4 bg-gray-50 rounded-xl text-sm">{user?.email}</p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                {editing ? (
                  <>
                    <button onClick={handleSave} disabled={loading} className="btn-primary">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Lưu thay đổi
                    </button>
                    <button onClick={() => setEditing(false)} className="btn-ghost">Huỷ</button>
                  </>
                ) : (
                  <button onClick={() => setEditing(true)} className="btn-outline"><Settings className="w-4 h-4" /> Chỉnh sửa</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
