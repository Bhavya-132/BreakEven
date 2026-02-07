import './globals.css';
import type { Metadata } from 'next';
import PrivacyNoticeBanner from '@/components/PrivacyNoticeBanner';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'BreakEven',
  description: 'A relationship finance toolkit for fair splits, safe separation, and exit planning.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="background-shape" />
        <div className="background-shape secondary" />
        <NavBar />
        <PrivacyNoticeBanner />
        {children}
      </body>
    </html>
  );
}
