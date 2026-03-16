import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const services = [
  { icon: '🏥', title: 'Khám tổng quát', desc: 'Kiểm tra sức khoẻ định kỳ toàn diện cho thú cưng', color: 'bg-blue-50 text-blue-600' },
  { icon: '💉', title: 'Tiêm phòng', desc: 'Chương trình tiêm chủng đầy đủ theo lịch chuẩn WHO', color: 'bg-green-50 text-green-600' },
  { icon: '🔬', title: 'Xét nghiệm', desc: 'Xét nghiệm máu, nước tiểu và các chỉ số sinh hoá', color: 'bg-purple-50 text-purple-600' },
  { icon: '🏨', title: 'Nội trú & điều trị', desc: 'Dịch vụ nội trú cao cấp với giám sát 24/7', color: 'bg-orange-50 text-orange-600' },
  { icon: '✂️', title: 'Phẫu thuật', desc: 'Phòng phẫu thuật vô trùng với trang thiết bị hiện đại', color: 'bg-red-50 text-red-600' },
  { icon: '🌿', title: 'Trị liệu toàn thể', desc: 'Châm cứu, vật lý trị liệu và liệu pháp tự nhiên', color: 'bg-teal-50 text-teal-600' },
];

export default function ServicesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Dịch vụ của chúng tôi</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Chúng tôi cung cấp đầy đủ các dịch vụ chăm sóc y tế cho thú cưng của bạn</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {services.map(s => (
            <div key={s.title} className="card p-6 hover:shadow-md transition-shadow group">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 ${s.color}`}>{s.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link href="/services" className="btn-outline inline-flex items-center gap-2">
            Xem tất cả dịch vụ <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
