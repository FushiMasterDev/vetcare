import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';

const doctors = [
  { name: 'BS. Nguyễn Văn An', spec: 'Nội khoa & Tim mạch', exp: '12 năm', rating: 4.9, avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'BS. Trần Thị Bình', spec: 'Ngoại khoa & Phẫu thuật', exp: '8 năm', rating: 4.8, avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'BS. Lê Minh Quân', spec: 'Da liễu & Dị ứng', exp: '10 năm', rating: 4.9, avatar: 'https://randomuser.me/api/portraits/men/55.jpg' },
];

export default function DoctorsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Đội ngũ bác sĩ</h2>
          <p className="text-gray-500 text-lg">Những chuyên gia hàng đầu với nhiều năm kinh nghiệm</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {doctors.map(d => (
            <div key={d.name} className="card p-6 text-center hover:shadow-md transition-shadow">
              <img src={d.avatar} alt={d.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4 ring-4 ring-green-100" />
              <h3 className="font-semibold text-gray-900 mb-1">{d.name}</h3>
              <p className="text-sm text-green-600 font-medium mb-1">{d.spec}</p>
              <p className="text-xs text-gray-500 mb-3">Kinh nghiệm: {d.exp}</p>
              <div className="flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-semibold text-gray-700">{d.rating}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link href="/services" className="btn-outline inline-flex items-center gap-2">
            Đặt lịch với bác sĩ <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
