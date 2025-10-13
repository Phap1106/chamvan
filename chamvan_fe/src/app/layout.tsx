import '@/app/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RootProviders from '@/components/providers/RootProviders';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['400','600','700'] });

export const metadata = {
  title: 'Chạm Vân',
  description: 'Website bán hàng đồ gỗ giả cổ Chạm Vân',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={inter.className}>
      <body className="min-h-dvh flex flex-col">
        <RootProviders>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </RootProviders>
      </body>
    </html>
  );
}
