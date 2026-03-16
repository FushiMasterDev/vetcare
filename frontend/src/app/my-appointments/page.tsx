'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsApi } from '@/lib/api';
import { Appointment, AppointmentStatus } from '@/types';
import MainLayout from '@/components/layout/MainLayout';
import toast from 'react-hot-toast';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; color: string; icon: any }> = {
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-green-50 text-green-700 border border-green-200', icon: CheckCircle },
  PENDING:   { label: 'Chờ xác nhận', color: 'bg-yellow-50 text-yellow-700 border border-yellow-200', icon: AlertCircle },
  COMPLETED: { label: 'Hoàn thành', color: 'bg-blue-50 text-blue-700 border border-blue-200', icon: CheckCircle },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-50 text-red-700 border border-red-200', icon: XCircle },
  NO_SHOW:   { label: 'Vắng mặt', color: 'bg-gray-50 text-gray-600 border border-gray-200', icon: XCircle },
};

export default function MyAppointmentsPage() {
  const qc = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: () => appointmentsApi.getMy().then(r => r.data as Appointment[]),
  });

  const cancelMut = useMutation({
    mutationFn: (id: number) => appointmentsApi.cancel(id, 'Người dùng hủy lịch'),
    onSuccess: () => {
      toast.success('Đã hủy lịch hẹn');
      qc.invalidateQueries({ queryKey: ['my-appointments'] });
    },
    onError: () => toast.error('Hủy lịch thất bại'),
  });

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-primary-600 to-teal-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-1">Lịch hẹn của tôi</h1>
          <p className="text-primary-100">Quản lý tất cả lịch khám của bạn</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="card h-36 animate-pulse bg-gray-100" />)}
          </div>
        ) : appointments?.length === 0 ? (
          <div className="text-center py-24">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có lịch hẹn nào</h3>
            <p className="text-gray-400 mb-6">Đặt lịch khám để chăm sóc sức khỏe cho thú cưng của bạn</p>
            <a href="/booking" className="btn-primary inline-block">Đặt lịch ngay</a>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments?.map(apt => {
              const cfg = STATUS_CONFIG[apt.status];
              const StatusIcon = cfg.icon;
              return (
                <div key={apt.id} className="card p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{apt.service.name}</h3>
                      <p className="text-sm text-gray-500">#{apt.id}</p>
                    </div>
                    <span className={`badge ${cfg.color} flex items-center gap-1 px-3 py-1.5`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {cfg.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary-500" />
                      <span>Bs. {apt.doctor.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary-500" />
                      <span>{apt.branch.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary-500" />
                      <span>{format(new Date(apt.appointmentDate), 'EEEE, dd/MM/yyyy', { locale: vi })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary-500" />
                      <span>{apt.appointmentTime}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl mb-4 text-sm">
                    <span className="font-medium text-gray-700">🐾 {apt.petName} ({apt.petType})</span>
                    <p className="text-gray-500 mt-0.5">{apt.reason}</p>
                  </div>

                  {apt.status === 'CONFIRMED' && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          if (confirm('Bạn có chắc muốn hủy lịch hẹn này?')) cancelMut.mutate(apt.id);
                        }}
                        disabled={cancelMut.isPending}
                        className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-xl transition-all">
                        {cancelMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                        Hủy lịch
                      </button>
                    </div>
                  )}
                  {apt.cancelReason && (
                    <p className="text-xs text-red-400 mt-2">Lý do hủy: {apt.cancelReason}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
