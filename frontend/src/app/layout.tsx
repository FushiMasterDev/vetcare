// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import QueryProvider from '@/components/providers/QueryProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'VetCare — Chăm sóc thú cưng chuyên nghiệp',
  description: 'Hệ thống phòng khám thú y hiện đại với đội ngũ bác sĩ chuyên nghiệp. Đặt lịch khám, chẩn đoán bệnh, điều trị toàn diện.',
  keywords: 'thú y, phòng khám thú cưng, bác sĩ thú y, đặt lịch khám thú cưng',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <QueryProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { background: '#fff', color: '#1f2937', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
              success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
              error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
