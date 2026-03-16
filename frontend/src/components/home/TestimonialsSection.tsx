import { Star, Quote } from 'lucide-react';

const testimonials = [
  { name: 'Chị Minh Châu', pet: 'Chủ của Mochi 🐱', text: 'Bác sĩ rất tận tâm và chuyên nghiệp. Mochi đã hồi phục hoàn toàn sau ca phẫu thuật. Rất hài lòng với dịch vụ!', rating: 5 },
  { name: 'Anh Quốc Hùng', pet: 'Chủ của Max 🐶', text: 'Đặt lịch rất nhanh, không phải chờ lâu. Cơ sở vật chất sạch sẽ, thoáng mát. Đội ngũ nhân viên nhiệt tình.', rating: 5 },
  { name: 'Chị Lan Anh', pet: 'Chủ của Pikachu 🐰', text: 'Dịch vụ nội trú rất chu đáo. Tôi yên tâm khi để thú cưng ở đây. Sẽ tiếp tục sử dụng dịch vụ lâu dài.', rating: 5 },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Khách hàng nói gì?</h2>
          <p className="text-gray-500 text-lg">Hơn 50,000 khách hàng đã tin tưởng chúng tôi</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="card p-6">
              <Quote className="w-8 h-8 text-green-200 mb-4" />
              <p className="text-gray-600 text-sm leading-relaxed mb-5">{t.text}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.pet}</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
