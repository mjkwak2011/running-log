import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '러닝 로그',
  description: '나만의 러닝 기록',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
