'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { Loader2, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import type { User } from '@/types';

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const { data: users, isLoading } = useQuery({ queryKey: ['admin-users'], queryFn: () => adminApi.getUsers().then(r => r.data) });

  const toggleMutation = useMutation({
    mutationFn: (id: number) => adminApi.toggleUserActive(id),
    onSuccess: () => { toast.success('Đã cập nhật!'); qc.invalidateQueries({ queryKey: ['admin-users'] }); },
  });

  const ROLE_LABELS: Record<string, string> = { ADMIN:'Admin', DOCTOR:'Bác sĩ', STAFF:'Nhân viên', USER:'Người dùng' };
  const ROLE_CLASS: Record<string, string> = { ADMIN:'bg-purple-50 text-purple-700', DOCTOR:'bg-blue-50 text-blue-700', STAFF:'bg-teal-50 text-teal-700', USER:'bg-gray-50 text-gray-700' };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Quản lý người dùng</h1>
      {isLoading ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div> : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['Họ tên','Email','Điện thoại','Vai trò','Đăng nhập qua','Trạng thái','Hành động'].map(h=><th key={h} className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(users as User[] || []).map((u: User) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{u.fullName}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3 text-gray-600">{u.phone || '—'}</td>
                  <td className="px-4 py-3"><span className={`badge ${ROLE_CLASS[u.role] || ''}`}>{ROLE_LABELS[u.role]}</span></td>
                  <td className="px-4 py-3 text-gray-500 capitalize">{u.provider?.toLowerCase()}</td>
                  <td className="px-4 py-3"><span className={`badge ${u.active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{u.active ? 'Hoạt động' : 'Bị khoá'}</span></td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleMutation.mutate(u.id)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
                      {u.active ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5 text-red-400" />}
                    </button>
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
