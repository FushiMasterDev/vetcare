'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, appointmentsApi } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Appointment } from '@/types';

const STATUS_OPTS = ['CONFIRMED','COMPLETED','CANCELLED','NO_SHOW'];
const STATUS_LABELS: Record<string, string> = { CONFIRMED:'Xác nhận', COMPLETED:'Hoàn thành', CANCELLED:'Đã huỷ', PENDING:'Chờ', NO_SHOW:'Vắng' };
const STATUS_CLASS: Record<string, string> = { CONFIRMED:'bg-blue-50 text-blue-700', COMPLETED:'bg-green-50 text-green-700', CANCELLED:'bg-red-50 text-red-700', PENDING:'bg-yellow-50 text-yellow-700', NO_SHOW:'bg-gray-50 text-gray-700' };

export default function AdminAppointmentsPage() {
  const qc = useQueryClient();
  const { data: appointments, isLoading } = useQuery({ queryKey: ['admin-appointments'], queryFn: () => adminApi.getAllAppointments().then(r => r.data) });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => appointmentsApi.updateStatus(id, status),
    onSuccess: () => { toast.success('Đã cập nhật!'); qc.invalidateQueries({ queryKey: ['admin-appointments'] }); },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Quản lý lịch hẹn</h1>
      {isLoading ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div> : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['Khách hàng','Bác sĩ','Dịch vụ','Ngày / Giờ','Thú cưng','Trạng thái'].map(h=><th key={h} className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(appointments as Appointment[] || []).map((a: Appointment) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{a.user?.fullName}<div className="text-xs text-gray-400">{a.user?.phone}</div></td>
                  <td className="px-4 py-3 text-gray-600">BS. {a.doctor?.fullName}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-[150px] truncate">{a.service?.name}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{a.appointmentDate}<div className="text-xs">{a.appointmentTime}</div></td>
                  <td className="px-4 py-3 text-gray-600">{a.petName && `${a.petName} (${a.petType})`}</td>
                  <td className="px-4 py-3">
                    <select value={a.status} onChange={e => statusMutation.mutate({ id: a.id, status: e.target.value })}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_CLASS[a.status] || ''}`}>
                      {STATUS_OPTS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
