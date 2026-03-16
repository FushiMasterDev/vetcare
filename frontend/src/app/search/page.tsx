'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import { servicesApi, doctorsApi } from '@/lib/api';
import { Service, Doctor } from '@/types';
import { Search, Filter, Star, Clock, Stethoscope, User } from 'lucide-react';
import Link from 'next/link';

type Tab = 'services' | 'doctors';

export default function SearchPage() {
  const [tab, setTab] = useState<Tab>('services');
  const [keyword, setKeyword] = useState('');
  const [symptom, setSymptom] = useState('');
  const [spec, setSpec] = useState('');

  const { data: services = [] } = useQuery({
    queryKey: ['search-services', keyword, symptom, spec],
    queryFn: async () => {
      if (symptom) return servicesApi.bySymptom(symptom).then(r => r.data as Service[]);
      if (spec) return servicesApi.bySpecialization(spec).then(r => r.data as Service[]);
      if (keyword) return servicesApi.search(keyword).then(r => r.data as Service[]);
      return servicesApi.getAll().then(r => r.data as Service[]);
    },
    enabled: tab === 'services',
  });

  const { data: doctors = [] } = useQuery({
    queryKey: ['search-doctors', keyword],
    queryFn: () => keyword ? doctorsApi.search(keyword).then(r => r.data as Doctor[]) : doctorsApi.getAll().then(r => r.data as Doctor[]),
    enabled: tab === 'doctors',
  });

  const { data: specs = [] } = useQuery({
    queryKey: ['specializations'],
    queryFn: () => servicesApi.getSpecializations().then(r => r.data as string[]),
  });

  const SYMPTOMS = ['Sốt', 'Nôn mửa', 'Tiêu chảy', 'Ho', 'Mất ăn', 'Ngứa da', 'Chảy nước mắt', 'Khó thở', 'Đau bụng', 'Yếu đuối'];

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-white mb-3">Tìm kiếm</h1>
          <p className="text-gray-400 mb-8">Tìm dịch vụ theo tên, triệu chứng, chuyên khoa hoặc bác sĩ</p>
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input value={keyword} onChange={e => setKeyword(e.target.value)}
              placeholder="Tìm kiếm dịch vụ, bác sĩ..."
              className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white text-sm focus:outline-none shadow-xl" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-8">
          {(['services', 'doctors'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {t === 'services' ? '🏥 Dịch vụ' : '👨‍⚕️ Bác sĩ'}
            </button>
          ))}
        </div>

        {/* Service filters */}
        {tab === 'services' && (
          <div className="space-y-4 mb-8">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Tìm theo triệu chứng:</p>
              <div className="flex flex-wrap gap-2">
                {SYMPTOMS.map(s => (
                  <button key={s} onClick={() => setSymptom(symptom === s ? '' : s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${symptom === s ? 'bg-red-500 text-white border-red-500' : 'border-gray-200 text-gray-600 hover:border-red-300'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Tìm theo chuyên khoa:</p>
              <div className="flex flex-wrap gap-2">
                {specs.map(s => (
                  <button key={s} onClick={() => setSpec(spec === s ? '' : s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${spec === s ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 text-gray-600 hover:border-green-300'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {tab === 'services' && (
          <div>
            <p className="text-sm text-gray-500 mb-4">Tìm thấy {services.length} dịch vụ</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map(s => (
                <Link href={`/services/${s.id}`} key={s.id} className="card p-5 hover:shadow-md transition-shadow group">
                  <div className="flex items-start gap-3">
                    {s.imageUrl ? <img src={s.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover" /> :
                      <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center text-2xl">🏥</div>}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-gray-900 group-hover:text-green-600 transition-colors">{s.name}</h3>
                      <p className="text-xs text-green-600 font-medium">{s.specialization}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{s.shortDescription}</p>
                    </div>
                  </div>
                  {s.symptoms.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {s.symptoms.slice(0, 3).map(sym => (
                        <span key={sym} className="badge bg-red-50 text-red-600 text-xs">{sym}</span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {tab === 'doctors' && (
          <div>
            <p className="text-sm text-gray-500 mb-4">Tìm thấy {doctors.length} bác sĩ</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {doctors.map(d => (
                <div key={d.id} className="card p-5 flex items-start gap-4">
                  {d.avatarUrl ? <img src={d.avatarUrl} alt="" className="w-16 h-16 rounded-full object-cover ring-2 ring-green-100" /> :
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xl shrink-0">
                      {d.fullName?.charAt(0)}
                    </div>}
                  <div>
                    <h3 className="font-semibold text-gray-900">{d.fullName}</h3>
                    <p className="text-sm text-green-600">{d.specialization}</p>
                    {d.yearsOfExperience && <p className="text-xs text-gray-500 mt-1">{d.yearsOfExperience} năm kinh nghiệm</p>}
                    {d.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                        <span className="text-xs font-medium">{d.rating.toFixed(1)}</span>
                      </div>
                    )}
                    <Link href="/booking" className="mt-2 inline-block text-xs text-green-600 font-medium hover:underline">Đặt lịch →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
