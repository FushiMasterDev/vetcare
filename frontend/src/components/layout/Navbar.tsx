'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Menu, X, Heart, ChevronDown, User, Calendar, LogOut, Settings, Search } from 'lucide-react';

const navLinks = [
  { href: '/',          label: 'Trang chủ' },
  { href: '/services',  label: 'Dịch vụ' },
  { href: '/community', label: 'Cộng đồng' },
  { href: '/branches',  label: 'Chi nhánh' },
  { href: '/booking',   label: 'Đặt lịch' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const handleLogout = () => { logout(); router.push('/login'); };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white border-b border-gray-100'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Vet<span className="text-green-600">Care</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${pathname === l.href ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/search" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-all"><Search className="w-5 h-5" /></Link>

            {isAuthenticated && user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-all">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    {user.avatarUrl
                      ? <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                      : <span className="text-green-700 font-semibold text-sm">{user.fullName?.charAt(0).toUpperCase()}</span>
                    }
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[100px] truncate">{user.fullName}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-20">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-900 truncate">{user.fullName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 mt-1">{user.role}</span>
                      </div>
                      <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"><User className="w-4 h-4" /> Trang cá nhân</Link>
                      <Link href="/booking/my" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"><Calendar className="w-4 h-4" /> Lịch hẹn của tôi</Link>
                      {(user.role === 'ADMIN' || user.role === 'STAFF') && (
                        <Link href="/admin/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"><Settings className="w-4 h-4" /> Quản trị</Link>
                      )}
                      <hr className="my-1 border-gray-100" />
                      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left"><LogOut className="w-4 h-4" /> Đăng xuất</button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50">Đăng nhập</Link>
                <Link href="/register" className="btn-primary text-sm">Đăng ký</Link>
              </div>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium ${pathname === l.href ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
