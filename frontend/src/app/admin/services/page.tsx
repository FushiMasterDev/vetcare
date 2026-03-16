'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { servicesApi } from '@/lib/api';
import { Service } from '@/types';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY = { name: '', description: '', shortDescription: '', imageUrl: '', price: '', durationMinutes: '', specialization: '', symptoms: '', active: true };

export default function AdminServicesPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<any>(EMPTY);

  const { data: services = [] } = useQuery({ queryKey: ['admin-services'], queryFn: () => servicesApi.getAll().then(r => r.data as Service[]) });

  const createMut = useMutation({
    mutationFn: (d: any) => servicesApi.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-services'] }); setShowForm(false); setForm(EMPTY); toast.success('Đã thêm dịch vụ!'); },
    onError: () => toast.error('Thêm dịch vụ thất bại'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: any) => servicesApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-services'] }); setEditing(null); toast.success('Đã cập nhật!'); },
    onError: () => toast.error('Cập nhật thất bại'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => servicesApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-services'] }); toast.success('Đã xoá dịch vụ'); },
    onError: () => toast.error('Xoá thất bại'),
  });

  const toPayload = (f: any) => ({
    ...f,
    price: f.price ? parseFloat(f.price) : null,
    durationMinutes: f.durationMinutes ? parseInt(f.durationMinutes) : null,
    symptoms: f.symptoms ? f.symptoms.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
  });

  const handleSubmit = () => {
    if (editing) updateMut.mutate({ id: editing.id, data: toPayload(form) });
    else createMut.mutate(toPayload(form));
  };

  const startEdit = (s: Service) => {
    setEditing(s);
    setForm({ ...s, price: s.price?.toString() || '', durationMinutes: s.durationMinutes?.toString() || '', symptoms: s.symptoms?.join(', ') || '' });
    setShowForm(true);
  };

  const FormModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-xl p-6 my-4">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-gray-900">{editing ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}</h3>
          <button onClick={() => { setShowForm(false); setEditing(null); setForm(EMPTY); }}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="space-y-4">
          {[
            { k: 'name', label: 'Tên dịch vụ *', placeholder: 'Khám tổng quát...' },
            { k: 'specialization', label: 'Chuyên khoa *', placeholder: 'Nội khoa, Ngoại khoa...' },
            { k: 'shortDescription', label: 'Mô tả ngắn', placeholder: 'Mô tả ngắn...' },
            { k: 'imageUrl', label: 'URL hình ảnh', placeholder: 'https://...' },
            { k: 'price', label: 'Giá (VND)', placeholder: '150000' },
            { k: 'durationMinutes', label: 'Thời gian (phút)', placeholder: '30' },
            { k: 'symptoms', label: 'Triệu chứng (cách nhau bằng dấu phẩy)', placeholder: 'Sốt, Nôn mửa, Ho...' },
          ].map(({ k, label, placeholder }) => (
            <div key={k}>
              <label className="label">{label}</label>
              <input value={form[k] || ''} onChange={e => setForm((p: any) => ({ ...p, [k]: e.target.value }))} placeholder={placeholder} className="input" />
            </div>
          ))}
          <div>
            <label className="label">Mô tả đầy đủ</label>
            <textarea value={form.description || ''} onChange={e => setForm((p: any) => ({ ...p, description: e.target.value }))} rows={3} className="input resize-none" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={e => setForm((p: any) => ({ ...p, active: e.target.checked }))} className="w-4 h-4 accent-green-600" />
            <span className="text-sm font-medium text-gray-700">Kích hoạt dịch vụ</span>
          </label>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => { setShowForm(false); setEditing(null); setForm(EMPTY); }} className="flex-1 btn-ghost justify-center">Huỷ</button>
          <button onClick={handleSubmit} disabled={!form.name || !form.specialization || createMut.isPending || updateMut.isPending} className="flex-1 btn-primary justify-center">
            <Check className="w-4 h-4" /> {editing ? 'Cập nhật' : 'Thêm dịch vụ'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Quản lý dịch vụ</h1>
          <p className="text-sm text-gray-500">{services.length} dịch vụ</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary"><Plus className="w-4 h-4" /> Thêm dịch vụ</button>
      </div>

      {showForm && <FormModal />}

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Tên dịch vụ', 'Chuyên khoa', 'Giá', 'Thời gian', 'Trạng thái', 'Hành động'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {services.map(s => (
              <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {s.imageUrl && <img src={s.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                    <div>
                      <p className="font-medium text-sm text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{s.shortDescription}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">{s.specialization}</td>
                <td className="px-5 py-4 text-sm font-medium text-green-600">{s.price ? `${Number(s.price).toLocaleString('vi-VN')}đ` : '—'}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{s.durationMinutes ? `${s.durationMinutes} phút` : '—'}</td>
                <td className="px-5 py-4">
                  <span className={`badge text-xs ${s.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {s.active ? 'Hoạt động' : 'Tạm dừng'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(s)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => { if (confirm('Xoá dịch vụ này?')) deleteMut.mutate(s.id); }} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
