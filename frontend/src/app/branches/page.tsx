'use client';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import { branchesApi } from '@/lib/api';
import { Branch } from '@/types';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';

export default function BranchesPage() {
  const { data: branches = [], isLoading } = useQuery({
    queryKey: ['branches'],
    queryFn: () => branchesApi.getAll().then(r => r.data as Branch[]),
  });

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-green-600 to-teal-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">Chi nhánh của chúng tôi</h1>
          <p className="text-green-100 text-lg">{branches.length} chi nhánh trên toàn quốc, luôn gần bạn</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="card h-64 skeleton" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map(b => (
              <div key={b.id} className="card hover:shadow-md transition-shadow">
                {b.imageUrl ? (
                  <img src={b.imageUrl} alt={b.name} className="w-full h-44 object-cover" />
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center text-4xl">🏥</div>
                )}
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 text-lg mb-3">{b.name}</h3>
                  <div className="space-y-2">
                    <p className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />{b.address}
                    </p>
                    {b.phone && <p className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-green-500 shrink-0" />{b.phone}
                    </p>}
                    {b.email && <p className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-green-500 shrink-0" />{b.email}
                    </p>}
                    {b.openingHours && <p className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-green-500 shrink-0" />{b.openingHours}
                    </p>}
                  </div>
                  {b.mapUrl && (
                    <a href={b.mapUrl} target="_blank" rel="noopener noreferrer"
                      className="mt-4 flex items-center gap-1.5 text-green-600 text-sm font-medium hover:underline">
                      <ExternalLink className="w-3.5 h-3.5" /> Xem trên bản đồ
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
export const dynamic = 'force-dynamic';
