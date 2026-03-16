'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { servicesApi } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import ServiceCard from '@/components/services/ServiceCard';
import { Search, Filter } from 'lucide-react';
import type { Service } from '@/types';

export default function ServicesPage() {
  const [keyword, setKeyword] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('');
  const [symptom, setSymptom] = useState('');

  const { data: services, isLoading } = useQuery({
    queryKey: ['services', keyword, selectedSpec, symptom],
    queryFn: async () => {
      if (symptom) return (await servicesApi.bySymptom(symptom)).data;
      if (keyword) return (await servicesApi.search(keyword)).data;
      if (selectedSpec) return (await servicesApi.bySpecialization(selectedSpec)).data;
      return (await servicesApi.getAll()).data;
    },
  });

  const { data: specializations } = useQuery({
    queryKey: ['specializations'],
    queryFn: () => servicesApi.getSpecializations().then(r => r.data),
  });

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dịch vụ của chúng tôi</h1>
          <p className="text-gray-500">Tìm dịch vụ phù hợp cho thú cưng của bạn</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="input pl-9"
                placeholder="Tìm theo tên dịch vụ..."
                value={keyword}
                onChange={e => { setKeyword(e.target.value); setSelectedSpec(''); setSymptom(''); }}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select className="input pl-9 appearance-none"
                value={selectedSpec}
                onChange={e => { setSelectedSpec(e.target.value); setKeyword(''); setSymptom(''); }}>
                <option value="">Tất cả chuyên khoa</option>
                {(specializations as string[] || []).map((s: string) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <input
                className="input"
                placeholder="Tìm theo triệu chứng (vd: ho, sốt...)"
                value={symptom}
                onChange={e => { setSymptom(e.target.value); setKeyword(''); setSelectedSpec(''); }}
              />
            </div>
          </div>
          {(keyword || selectedSpec || symptom) && (
            <button onClick={() => { setKeyword(''); setSelectedSpec(''); setSymptom(''); }}
              className="mt-3 text-sm text-primary-600 hover:underline">
              Xoá bộ lọc
            </button>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({length: 6}).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{(services as Service[])?.length || 0} dịch vụ</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(services as Service[] || []).map((s: Service) => <ServiceCard key={s.id} service={s} />)}
            </div>
            {!services?.length && (
              <div className="text-center py-16 text-gray-400">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-medium">Không tìm thấy dịch vụ phù hợp</p>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
export const dynamic = 'force-dynamic';
