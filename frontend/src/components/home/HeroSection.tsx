import Link from 'next/link';
import { Search, ArrowRight, Star, Shield, Clock } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-green-50 via-white to-teal-50 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Star className="w-3.5 h-3.5 fill-current" />
              Phòng khám thú y số 1 Việt Nam
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Chăm sóc thú cưng{' '}
              <span className="text-green-600 relative">
                toàn diện
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 10 Q75 2 150 10 Q225 18 298 10" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" fill="none" />
                </svg>
              </span>{' '}
              & chuyên nghiệp
            </h1>
            <p className="text-xl text-gray-500 mb-8 leading-relaxed">
              Đội ngũ bác sĩ thú y giàu kinh nghiệm, trang thiết bị hiện đại và dịch vụ chăm sóc 24/7 cho người bạn bốn chân của bạn.
            </p>

            {/* Search bar */}
            <div className="flex gap-3 mb-8 max-w-lg">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Tìm dịch vụ, triệu chứng, bác sĩ..." readOnly
                  className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm cursor-pointer"
                  onClick={() => window.location.href = '/search'}
                />
              </div>
              <Link href="/search" className="btn-primary py-3.5 px-5 shadow-sm">
                Tìm kiếm
              </Link>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/booking" className="btn-primary py-3 px-6 shadow-md hover:shadow-lg">
                Đặt lịch ngay <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/services" className="text-sm font-medium text-gray-700 hover:text-green-600 flex items-center gap-1">
                Xem dịch vụ <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Hero image / stats cards */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-teal-500 rounded-3xl shadow-2xl opacity-10 transform rotate-6" />
              <img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80"
                alt="Vet caring for pet" className="relative rounded-3xl object-cover w-full h-full shadow-xl" />

              {/* Floating cards */}
              <div className="absolute -top-4 -left-6 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3 animate-slide-up">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Được tin tưởng bởi</p>
                  <p className="text-sm font-bold text-gray-900">50,000+ khách hàng</p>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-6 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Hỗ trợ</p>
                  <p className="text-sm font-bold text-gray-900">24/7 khẩn cấp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
