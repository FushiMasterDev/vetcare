import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, ArrowRight } from 'lucide-react';
import type { Service } from '@/types';

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link href={`/services/${service.id}`} className="card group block">
      <div className="relative h-48 bg-primary-50 overflow-hidden">
        {service.imageUrl ? (
          <Image src={service.imageUrl} alt={service.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🐾</div>
        )}
        <div className="absolute top-3 left-3">
          <span className="badge bg-primary-100 text-primary-700">{service.specialization}</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 mb-1.5 group-hover:text-primary-600 transition-colors line-clamp-1">{service.name}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{service.shortDescription || service.description}</p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3 text-gray-400">
            {service.avgRating && (
              <span className="flex items-center gap-1 text-amber-500 font-medium">
                <Star className="w-3.5 h-3.5 fill-current" /> {service.avgRating.toFixed(1)}
              </span>
            )}
            {service.durationMinutes && (
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {service.durationMinutes} phút</span>
            )}
          </div>
          {service.price && (
            <span className="text-primary-600 font-semibold">{service.price.toLocaleString('vi-VN')}đ</span>
          )}
        </div>
        <div className="mt-3 flex items-center gap-1 text-primary-600 text-sm font-medium">
          Xem chi tiết <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
}
