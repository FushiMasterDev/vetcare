'use client';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { Users, Stethoscope, Calendar, CheckCircle, XCircle, BarChart3, Loader2 } from 'lucide-react';
import type { DashboardStats } from '@/types';

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.getDashboard().then(r => r.data),
  });

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

  const CARDS = [
    { label: 'Tổng người dùng', value: stats?.totalUsers, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Bác sĩ', value: stats?.totalDoctors, icon: Stethoscope, color: 'bg-purple-50 text-purple-600' },
    { label: 'Tổng lịch hẹn', value: stats?.totalAppointments, icon: Calendar, color: 'bg-primary-50 text-primary-600' },
    { label: 'Hoàn thành', value: stats?.completedAppointments, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
    { label: 'Đã xác nhận', value: stats?.confirmedAppointments, icon: BarChart3, color: 'bg-teal-50 text-teal-600' },
    { label: 'Đã huỷ', value: stats?.cancelledAppointments, icon: XCircle, color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Tổng quan hệ thống VetCare</p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        {CARDS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500 font-medium">{label}</p>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{value ?? 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
