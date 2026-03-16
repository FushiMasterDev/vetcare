'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { servicesApi } from '@/lib/api';
import { Service } from '@/types';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ChevronLeft, Plus, X, Save, Loader2 } from 'lucide-react';

export default function AdminServiceFormPage({ params }: { params?: { id?: string } }) {
  const router = useRouter();
  const isEdit = !!params?.id && params.id !== 'new';

  const [form, setForm] = useState({
    name: '', description: '', shortDescription: '', imageUrl: '',
    price: '', durationMinutes: '', specialization: '', active: true,
  });
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [newSymptom, setNewSymptom] = useState('');

  const { data: service } = useQuery({
    queryKey: ['service-edit', params?.id],
    queryFn: () => servicesApi.getById(Number(params?.id)).then(r => r.data as Service),
    enabled: isEdit,
  });

  useEffect(() => {
    if (service) {
      setForm({
        name: service.name, description: service.description || '',
        shortDescription: service.shortDescription || '', imageUrl: service.imageUrl || '',
        price: service.price?.toString() || '', durationMinutes: service.durationMinutes?.toString() || '',
        specialization: service.specialization, active: service.active,
      });
      setSymptoms(service.symptoms || []);
    }
  }, [service]);

  const saveMut = useMutation({
    mutationFn: () => {
      const payload = {
        ...form, symptoms,
        price: form.price ? parseFloat(form.price) : null,
        durationMinutes: form.durationMinutes ? parseInt(form.durationMinutes) : null,
      };
      return isEdit ? servicesApi.update(Number(params?.id), payload) : servicesApi.create(payload);
    },
    onSuccess: () => {
      toast.success(isEdit ? 'Cập nhật dịch vụ thành công!' : 'Tạo dịch vụ thành công!');
      router.push('/admin');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Lỗi khi lưu dịch vụ'),
  });

  const addSymptom = () => {
    if (newSymptom.trim() && !symptoms.includes(newSymptom.trim())) {
      setSymptoms([...symptoms, newSymptom.trim()]);
      setNewSymptom('');
    }
  };

  const SPECIALIZATIONS = ['Nội khoa', 'Ngoại khoa', 'Da liễu', 'Nha khoa', 'Nhãn khoa', 'Xương khớp', 'Tim mạch', 'Thần kinh', 'Dinh dưỡng', 'Trị liệu toàn thân'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Basic info */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Thông tin cơ bản</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Tên dịch vụ *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                placeholder="Ví dụ: Khám tổng quát" className="input" />
            </div>
            <div>
              <label className="label">Mô tả ngắn</label>
              <input value={form.shortDescription} onChange={e => setForm({...form, shortDescription: e.target.value})}
                placeholder="Mô tả ngắn gọn về dịch vụ" className="input" />
            </div>
            <div>
              <label className="label">Mô tả chi tiết</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                rows={4} className="input resize-none" placeholder="Mô tả đầy đủ về dịch vụ, quy trình, lợi ích..." />
            </div>
            <div>
              <label className="label">URL ảnh đại diện</label>
              <input value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})}
                placeholder="https://..." className="input" />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Chi tiết dịch vụ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Chuyên khoa *</label>
              <select value={form.specialization} onChange={e => setForm({...form, specialization: e.target.value})} className="input">
                <option value="">-- Chọn --</option>
                {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Giá (VND)</label>
              <input value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                type="number" placeholder="200000" className="input" />
            </div>
            <div>
              <label className="label">Thời gian (phút)</label>
              <input value={form.durationMinutes} onChange={e => setForm({...form, durationMinutes: e.target.value})}
                type="number" placeholder="30" className="input" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <input type="checkbox" id="active" checked={form.active} onChange={e => setForm({...form, active: e.target.checked})}
              className="w-5 h-5 rounded text-primary-600" />
            <label htmlFor="active" className="text-sm font-medium text-gray-700">Hiển thị dịch vụ (Active)</label>
          </div>
        </div>

        {/* Symptoms */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Triệu chứng điều trị</h2>
          <div className="flex gap-2 mb-4">
            <input value={newSymptom} onChange={e => setNewSymptom(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSymptom())}
              placeholder="Nhập triệu chứng và nhấn Enter..." className="input flex-1" />
            <button type="button" onClick={addSymptom} className="btn-outline flex items-center gap-2">
              <Plus className="w-4 h-4" /> Thêm
            </button>
          </div>
          {symptoms.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {symptoms.map(s => (
                <span key={s} className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1.5 rounded-full text-sm">
                  {s}
                  <button onClick={() => setSymptoms(symptoms.filter(x => x !== s))} className="hover:text-red-500 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button onClick={() => saveMut.mutate()} disabled={!form.name || !form.specialization || saveMut.isPending}
            className="btn-primary flex items-center gap-2 px-8 py-3">
            {saveMut.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isEdit ? 'Cập nhật dịch vụ' : 'Tạo dịch vụ'}
          </button>
          <Link href="/admin" className="btn-ghost py-3 px-6">Hủy</Link>
        </div>
      </div>
    </div>
  );
}
