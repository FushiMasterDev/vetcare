import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Sẵn sàng chăm sóc thú cưng của bạn?</h2>
        <p className="text-gray-400 text-lg mb-8">Đặt lịch ngay hôm nay và nhận tư vấn miễn phí từ đội ngũ bác sĩ chuyên nghiệp.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/booking" className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
            Đặt lịch khám <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="tel:18001234" className="border border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white font-medium px-8 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
            <Phone className="w-4 h-4" /> Gọi 1800 1234
          </a>
        </div>
      </div>
    </section>
  );
}
