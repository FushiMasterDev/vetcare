'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { servicesApi, doctorsApi, reviewsApi } from '@/lib/api';
import { Service, Doctor, Review } from '@/types';
import { useAuthStore } from '@/lib/store';
import MainLayout from '@/components/layout/MainLayout';
import DoctorCard from '@/components/services/DoctorCard';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, Tag, Calendar, ChevronLeft, MessageSquare, Send, User, Loader2 } from 'lucide-react';

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)}>
          <Star className={`w-7 h-7 transition-colors ${n <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`} />
        </button>
      ))}
    </div>
  );
}

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const qc = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: () => servicesApi.getById(Number(id)).then(r => r.data as Service),
  });
  const { data: doctors } = useQuery({
    queryKey: ['doctors-service', id],
    queryFn: () => doctorsApi.byService(Number(id)).then(r => r.data as Doctor[]),
  });
  const { data: reviews } = useQuery({
    queryKey: ['reviews-service', id],
    queryFn: () => reviewsApi.byService(Number(id)).then(r => r.data as Review[]),
  });

  const reviewMut = useMutation({
    mutationFn: () => reviewsApi.create({ serviceId: Number(id), rating, comment }),
    onSuccess: () => {
      toast.success('Cảm ơn đánh giá của bạn!');
      setRating(5); setComment('');
      qc.invalidateQueries({ queryKey: ['reviews-service', id] });
    },
    onError: () => toast.error('Gửi đánh giá thất bại'),
  });

  if (isLoading) return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
        {[1,2,3].map(i => <div key={i} className="card h-32 animate-pulse bg-gray-100" />)}
      </div>
    </MainLayout>
  );

  if (!service) return (
    <MainLayout>
      <div className="text-center py-24">
        <p className="text-gray-500 mb-4">Không tìm thấy dịch vụ</p>
        <Link href="/services" className="btn-primary inline-block">Quay lại danh sách</Link>
      </div>
    </MainLayout>
  );

  const avgRating = reviews?.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 text-sm transition-colors">
          <ChevronLeft className="w-4 h-4" /> Quay lại
        </button>

        <div className="card overflow-hidden mb-8">
          {service.imageUrl && (
            <div className="relative h-64">
              <Image src={service.imageUrl} alt={service.name} fill className="object-cover" />
            </div>
          )}
          <div className="p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <span className="badge bg-primary-50 text-primary-700 mb-2">{service.specialization}</span>
                <h1 className="text-3xl font-bold text-gray-900">{service.name}</h1>
              </div>
              <Link href={`/booking?service=${service.id}`} className="btn-primary flex items-center gap-2 flex-shrink-0">
                <Calendar className="w-4 h-4" /> Đặt lịch ngay
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-5">
              {avgRating && (
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <strong className="text-gray-800">{avgRating.toFixed(1)}</strong> ({reviews?.length} đánh giá)
                </span>
              )}
              {service.durationMinutes && (
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary-500" /> {service.durationMinutes} phút</span>
              )}
              {service.price && (
                <span className="flex items-center gap-1.5 font-semibold text-primary-700">
                  <Tag className="w-4 h-4" /> {service.price.toLocaleString('vi-VN')}đ
                </span>
              )}
            </div>
            <p className="text-gray-600 leading-relaxed">{service.description}</p>
            {service.symptoms?.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Triệu chứng điều trị</h3>
                <div className="flex flex-wrap gap-2">
                  {service.symptoms.map(s => <span key={s} className="badge bg-orange-50 text-orange-700 px-3 py-1">{s}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>

        {doctors && doctors.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Bác sĩ phụ trách</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {doctors.map(d => <DoctorCard key={d.id} doctor={d} />)}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">Đánh giá <span className="text-gray-400 font-normal text-base">({reviews?.length ?? 0})</span></h2>
            {avgRating && (
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-gray-900">{avgRating.toFixed(1)}</span>
                <div>
                  <div className="flex">
                    {[1,2,3,4,5].map(n => <Star key={n} className={`w-4 h-4 ${n <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />)}
                  </div>
                  <p className="text-xs text-gray-400">{reviews?.length} đánh giá</p>
                </div>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div className="card p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary-600" /> Viết đánh giá
              </h3>
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">Chất lượng dịch vụ</p>
                <StarPicker value={rating} onChange={setRating} />
              </div>
              <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
                placeholder="Chia sẻ trải nghiệm của bạn..." className="input resize-none mb-3" />
              <button onClick={() => reviewMut.mutate()} disabled={reviewMut.isPending}
                className="btn-primary flex items-center gap-2">
                {reviewMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Gửi đánh giá
              </button>
            </div>
          ) : (
            <div className="card p-5 mb-6 text-center bg-primary-50 border border-primary-100">
              <p className="text-primary-700 text-sm">
                <Link href="/login" className="font-semibold hover:underline">Đăng nhập</Link> để viết đánh giá
              </p>
            </div>
          )}

          <div className="space-y-4">
            {reviews?.map(r => (
              <div key={r.id} className="card p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900 text-sm">{r.user.fullName}</p>
                      <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div className="flex mb-2">
                      {[1,2,3,4,5].map(n => <Star key={n} className={`w-3.5 h-3.5 ${n <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />)}
                    </div>
                    {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
                  </div>
                </div>
              </div>
            ))}
            {reviews?.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Star className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                <p>Chưa có đánh giá. Hãy là người đầu tiên!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
