'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsApi } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import Link from 'next/link';
import { Calendar, Clock, MapPin, User, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Appointment } from '@/types';

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  CONFIRMED: { label: 'Đã xác nhận', className: 'bg-blue-50 text-blue-700' },
  COMPLETED: { label: 'Hoàn thành', className: 'bg-green-50 text-green-700' },
  CANCELLED: { label: 'Đã huỷ', className: 'bg-red-50 text-red-700' },
  PENDING:   { label: 'Chờ xác nhận', className: 'bg-yellow-50 text-yellow-700' },
  NO_SHOW:   { label: 'Vắng mặt', className: 'bg-gray-50 text-gray-700' },
};

export default function MyAppointmentsPage() {
  const qc = useQueryClient();
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: () => appointmentsApi.getMy().then(r => r.data),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => appointmentsApi.cancel(id, 'Huỷ bởi người dùng'),
    onSuccess: () => { toast.success('Đã huỷ lịch hẹn'); qc.invalidateQueries({ queryKey: ['my-appointments'] }); },
    onError: () => toast.error('Huỷ thất bại'),
  });

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Lịch hẹn của tôi</h1>
          <Link href="/booking" className="btn-primary text-sm"><Calendar className="w-4 h-4" /> Đặt lịch mới</Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>
        ) : (
          <div className="space-y-4">
            {(appointments as Appointment[] || []).map((apt: Appointment) => {
              const status = STATUS_LABELS[apt.status] || STATUS_LABELS.PENDING;
              return (
                <div key={apt.id} className="card p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{apt.service?.name}</h3>
                      <span className={`badge mt-1 ${status.className}`}>{status.label}</span>
                    </div>
                    {apt.status === 'CONFIRMED' && (
                      <button onClick={() => { if (confirm('Huỷ lịch hẹn này?')) cancelMutation.mutate(apt.id); }}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary-500" />{apt.appointmentDate}</div>
                    <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary-500" />{apt.appointmentTime}</div>
                    <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-primary-500" />BS. {apt.doctor?.fullName}</div>
                    <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary-500" />{apt.branch?.name}</div>
                  </div>
                  {apt.petName && <p className="text-sm text-gray-500 mt-2">🐾 {apt.petName} ({apt.petType})</p>}
                  {apt.reason && <p className="text-sm text-gray-600 mt-2 bg-gray-50 rounded-lg px-3 py-2">{apt.reason}</p>}
                </div>
              );
            })}
            {!appointments?.length && (
              <div className="text-center py-16 text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Bạn chưa có lịch hẹn nào</p>
                <Link href="/booking" className="btn-primary mt-4 inline-flex">Đặt lịch ngay</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
