'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import { appointmentsApi } from '@/lib/api';
import { Appointment, AppointmentStatus } from '@/types';
import { Calendar, Clock, User, MapPin, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import Link from 'next/link';

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; color: string }> = {
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-green-100 text-green-700' },
  PENDING: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700' },
  COMPLETED: { label: 'Hoàn thành', color: 'bg-blue-100 text-blue-700' },
  CANCELLED: { label: 'Đã huỷ', color: 'bg-red-100 text-red-700' },
  NO_SHOW: { label: 'Vắng mặt', color: 'bg-gray-100 text-gray-600' },
};

export default function AppointmentsPage() {
  const qc = useQueryClient();
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: () => appointmentsApi.getMy().then(r => r.data as Appointment[]),
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => appointmentsApi.cancel(id, reason),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['my-appointments'] }); setCancelId(null); toast.success('Đã huỷ lịch hẹn'); },
    onError: () => toast.error('Huỷ lịch thất bại'),
  });

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Lịch hẹn của tôi</h1>
        <p className="text-gray-500 mb-8">Quản lý tất cả các lịch khám của bạn</p>
        {isLoading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="card h-32 skeleton" />)}</div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Bạn chưa có lịch hẹn nào</p>
            <Link href="/booking" className="btn-primary inline-flex">Đặt lịch ngay</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map(apt => {
              const status = STATUS_CONFIG[apt.status];
              return (
                <div key={apt.id} className="card p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold text-gray-900">{apt.service.name}</p>
                      <p className="text-xs text-gray-500">Mã #{apt.id}</p>
                    </div>
                    <span className={`badge ${status.color} text-xs`}>{status.label}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="text-sm"><p className="text-xs text-gray-400 mb-0.5">Ngày khám</p><p className="font-medium">{apt.appointmentDate}</p></div>
                    <div className="text-sm"><p className="text-xs text-gray-400 mb-0.5">Giờ</p><p className="font-medium">{apt.appointmentTime?.slice(0,5)}</p></div>
                    <div className="text-sm"><p className="text-xs text-gray-400 mb-0.5">Bác sĩ</p><p className="font-medium truncate">{apt.doctor.fullName}</p></div>
                    <div className="text-sm"><p className="text-xs text-gray-400 mb-0.5">Chi nhánh</p><p className="font-medium truncate">{apt.branch.name}</p></div>
                  </div>
                  {apt.reason && <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-3"><span className="font-medium">Lý do:</span> {apt.reason}</p>}
                  {apt.status === 'CONFIRMED' && (
                    <div className="flex justify-end">
                      <button onClick={() => setCancelId(apt.id)} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1.5 font-medium">
                        <X className="w-4 h-4" /> Huỷ lịch
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {cancelId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="font-semibold mb-3">Huỷ lịch hẹn</h3>
              <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)} placeholder="Lý do huỷ..." rows={3} className="input resize-none mb-4" />
              <div className="flex gap-3">
                <button onClick={() => setCancelId(null)} className="flex-1 btn-ghost justify-center">Quay lại</button>
                <button onClick={() => cancelMutation.mutate({ id: cancelId, reason: cancelReason })} disabled={!cancelReason || cancelMutation.isPending}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2.5 rounded-xl disabled:opacity-50 inline-flex justify-center">
                  Xác nhận huỷ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
