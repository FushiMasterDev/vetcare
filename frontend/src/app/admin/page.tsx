'use client';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { DashboardStats } from '@/types';
import { Users, Stethoscope, Layers, Calendar, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.getDashboard().then(r => r.data),
  });

  const cards = stats ? [
    { label: 'Tổng người dùng', value: stats.totalUsers, icon: Users, color: 'bg-blue-50 text-blue-600', href: '/admin/users' },
    { label: 'Tổng bác sĩ', value: stats.totalDoctors, icon: Stethoscope, color: 'bg-green-50 text-green-600', href: '/admin/doctors' },
    { label: 'Tổng dịch vụ', value: stats.totalServices, icon: Layers, color: 'bg-purple-50 text-purple-600', href: '/admin/services' },
    { label: 'Tổng lịch hẹn', value: stats.totalAppointments, icon: Calendar, color: 'bg-orange-50 text-orange-600', href: '/admin/appointments' },
    { label: 'Đã xác nhận', value: stats.confirmedAppointments, icon: CheckCircle, color: 'bg-teal-50 text-teal-600', href: '/admin/appointments' },
    { label: 'Đã huỷ', value: stats.cancelledAppointments, icon: XCircle, color: 'bg-red-50 text-red-600', href: '/admin/appointments' },
  ] : [];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-gray-500 mb-8">Tổng quan hệ thống VetCare</p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {cards.map(c => (
          <Link href={c.href} key={c.label} className="card p-5 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.color}`}>
              <c.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{c.value?.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">{c.label}</p>
          </Link>
        ))}
      </div>
      <h2 className="text-lg font-semibold mb-4">Quản lý nhanh</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { href: '/admin/services', icon: '🏥', label: 'Quản lý dịch vụ', desc: 'Thêm, sửa, xoá dịch vụ' },
          { href: '/admin/doctors', icon: '👨‍⚕️', label: 'Quản lý bác sĩ', desc: 'Quản lý đội ngũ bác sĩ' },
          { href: '/admin/branches', icon: '🏢', label: 'Quản lý chi nhánh', desc: 'Thêm và cập nhật chi nhánh' },
          { href: '/admin/appointments', icon: '📅', label: 'Quản lý lịch hẹn', desc: 'Xem và duyệt lịch hẹn' },
          { href: '/admin/users', icon: '👥', label: 'Quản lý người dùng', desc: 'Quản lý tài khoản người dùng' },
        ].map(l => (
          <Link href={l.href} key={l.href} className="card p-5 hover:shadow-md transition-shadow flex items-center gap-4">
            <span className="text-3xl">{l.icon}</span>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{l.label}</p>
              <p className="text-xs text-gray-500">{l.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
