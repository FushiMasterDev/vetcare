'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PawPrint, LayoutDashboard, Layers, Stethoscope, MapPin, Calendar, Users, LogOut, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

const sideLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/services', label: 'Dịch vụ', icon: Layers },
  { href: '/admin/doctors', label: 'Bác sĩ', icon: Stethoscope },
  { href: '/admin/branches', label: 'Chi nhánh', icon: MapPin },
  { href: '/admin/appointments', label: 'Lịch hẹn', icon: Calendar },
  { href: '/admin/users', label: 'Người dùng', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, user } = useAuthStore();
  const router = useRouter();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col shrink-0">
        <div className="p-5 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-white">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <PawPrint className="w-4 h-4 text-white" />
            </div>
            VetCare Admin
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sideLinks.map(l => {
            const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <l.icon className="w-4 h-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Về trang chủ
          </Link>
          <button onClick={() => { logout(); router.push('/login'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-900/30 transition-colors">
            <LogOut className="w-4 h-4" /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="border-b bg-white px-8 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">Xin chào, <span className="font-semibold text-gray-800">{user?.fullName}</span></p>
          <span className="badge bg-purple-100 text-purple-700 text-xs">Admin</span>
        </div>
        {children}
      </main>
    </div>
  );
}
