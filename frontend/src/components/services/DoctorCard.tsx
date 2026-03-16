import Image from 'next/image';
import { Star, MapPin } from 'lucide-react';
import type { Doctor } from '@/types';

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <div className="card text-center p-6 group">
      <div className="relative w-20 h-20 mx-auto mb-4">
        {doctor.avatarUrl ? (
          <Image src={doctor.avatarUrl} alt={doctor.fullName} fill className="object-cover rounded-full" />
        ) : (
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-2xl font-bold text-primary-600">
            {doctor.fullName[0]}
          </div>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 mb-0.5">BS. {doctor.fullName}</h3>
      <p className="text-sm text-primary-600 font-medium mb-2">{doctor.specialization}</p>
      {doctor.rating && (
        <div className="flex items-center justify-center gap-1 text-sm text-amber-500 mb-2">
          <Star className="w-4 h-4 fill-current" />
          <span className="font-medium">{doctor.rating.toFixed(1)}</span>
          <span className="text-gray-400">({doctor.totalReviews} đánh giá)</span>
        </div>
      )}
      {doctor.yearsOfExperience && (
        <p className="text-xs text-gray-400">{doctor.yearsOfExperience} năm kinh nghiệm</p>
      )}
      {doctor.branch && (
        <p className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
          <MapPin className="w-3 h-3" /> {doctor.branch.name}
        </p>
      )}
    </div>
  );
}
