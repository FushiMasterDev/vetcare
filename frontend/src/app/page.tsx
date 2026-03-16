'use client';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { servicesApi, doctorsApi } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import ServiceCard from '@/components/services/ServiceCard';
import DoctorCard from '@/components/services/DoctorCard';
import { Calendar, Shield, Clock, Star, ArrowRight, Phone, PawPrint } from 'lucide-react';
import type { Service, Doctor } from '@/types';

const STATS = [
  { value: '50+', label: 'Bác sĩ chuyên khoa' },
  { value: '10+', label: 'Chi nhánh toàn quốc' },
  { value: '20,000+', label: 'Thú cưng đã khám' },
  { value: '98%', label: 'Khách hàng hài lòng' },
];

const WHY_US = [
  { icon: Shield, title: 'Đội ngũ chuyên nghiệp', desc: 'Bác sĩ được đào tạo bài bản, nhiều năm kinh nghiệm trong điều trị thú cưng.' },
  { icon: Clock, title: 'Phục vụ 24/7', desc: 'Luôn sẵn sàng hỗ trợ khẩn cấp mọi lúc, mọi nơi cho thú cưng của bạn.' },
  { icon: Star, title: 'Trang thiết bị hiện đại', desc: 'Máy móc chẩn đoán tiên tiến, phòng mổ vô trùng chuẩn quốc tế.' },
  { icon: PawPrint, title: 'Chăm sóc toàn diện', desc: 'Từ phòng ngừa, điều trị đến phục hồi chức năng cho thú cưng.' },
];

export default function HomePage() {
  const { data: services } = useQuery({
    queryKey: ['services-home'],
    queryFn: () => servicesApi.getAll().then(r => r.data),
  });
  const { data: doctors } = useQuery({
    queryKey: ['doctors-home'],
    queryFn: () => doctorsApi.getAll().then(r => r.data),
  });

  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-teal-600 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full border-2 border-white" />
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full border-2 border-white" />
          <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-white" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <PawPrint className="w-4 h-4" /> Phòng khám thú y hàng đầu Việt Nam
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Chăm sóc thú cưng<br />
              <span className="text-green-300">tận tâm & chuyên nghiệp</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
              Đội ngũ bác sĩ thú y giàu kinh nghiệm, trang thiết bị hiện đại — mang lại sức khoẻ tốt nhất cho người bạn bốn chân của bạn.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/booking" className="bg-white text-primary-700 hover:bg-green-50 font-semibold py-3 px-6 rounded-xl transition-all inline-flex items-center gap-2 shadow-lg">
                <Calendar className="w-5 h-5" /> Đặt lịch ngay
              </Link>
              <Link href="/services" className="border-2 border-white/60 hover:border-white hover:bg-white/10 font-semibold py-3 px-6 rounded-xl transition-all inline-flex items-center gap-2">
                Xem dịch vụ <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Dịch vụ của chúng tôi</h2>
            <p className="section-subtitle mx-auto">Cung cấp đầy đủ các dịch vụ chăm sóc sức khoẻ thú cưng từ phòng ngừa đến điều trị chuyên sâu</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(services as Service[] || []).slice(0, 6).map((s: Service) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
          {services?.length > 6 && (
            <div className="text-center mt-8">
              <Link href="/services" className="btn-outline">Xem tất cả dịch vụ <ArrowRight className="w-4 h-4" /></Link>
            </div>
          )}
        </div>
      </section>

      {/* Why us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Tại sao chọn VetCare?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-2xl hover:bg-primary-50 transition-colors group">
                <div className="w-14 h-14 bg-primary-100 group-hover:bg-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                  <Icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Đội ngũ bác sĩ</h2>
            <p className="section-subtitle mx-auto">Gặp gỡ những chuyên gia hàng đầu luôn tận tâm với sức khoẻ thú cưng</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(doctors as Doctor[] || []).slice(0, 4).map((d: Doctor) => (
              <DoctorCard key={d.id} doctor={d} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Đặt lịch khám ngay hôm nay</h2>
          <p className="text-white/80 mb-8">Thú cưng của bạn xứng đáng được chăm sóc tốt nhất. Hãy đặt lịch để gặp bác sĩ của chúng tôi.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/booking" className="bg-white text-primary-700 hover:bg-green-50 font-semibold py-3 px-8 rounded-xl transition-all inline-flex items-center gap-2 shadow-lg">
              <Calendar className="w-5 h-5" /> Đặt lịch khám
            </Link>
            <a href="tel:19001234" className="border-2 border-white/60 hover:bg-white/10 font-semibold py-3 px-8 rounded-xl transition-all inline-flex items-center gap-2">
              <Phone className="w-5 h-5" /> 1900 1234
            </a>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
