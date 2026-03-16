import Link from 'next/link';
import { Heart, Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold text-white">Vet<span className="text-green-400">Care</span></span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 mb-5">Hệ thống phòng khám thú y hiện đại, đội ngũ bác sĩ chuyên nghiệp.</p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Dịch vụ</h4>
            <ul className="space-y-2 text-sm">
              {['Khám tổng quát','Tiêm phòng','Phẫu thuật','Nha khoa','Xét nghiệm'].map(s=>(
                <li key={s}><Link href="/services" className="hover:text-green-400 transition-colors">{s}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Liên kết</h4>
            <ul className="space-y-2 text-sm">
              {[['/', 'Trang chủ'],['/community','Cộng đồng'],['/branches','Chi nhánh'],['/booking','Đặt lịch']].map(([href,label])=>(
                <li key={href}><Link href={href} className="hover:text-green-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3"><MapPin className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /><span>123 Đường Láng, Đống Đa, Hà Nội</span></li>
              <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-green-400" /><a href="tel:19001234" className="hover:text-green-400">1900 1234</a></li>
              <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-green-400" /><a href="mailto:info@vetcare.vn" className="hover:text-green-400">info@vetcare.vn</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} VetCare. Bảo lưu mọi quyền.
        </div>
      </div>
    </footer>
  );
}
