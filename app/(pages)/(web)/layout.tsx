'use client';

import Navbar from '@/app/(pages)/(web)/components/navbar';
import Footer from '@/app/(pages)/(web)/components/footer';

export default function WebLayout({ children }: { children: React.ReactNode }) {
  // useSmoothScroll();

  return (
      <div className='min-h-screen flex flex-col'>
        <Navbar />
        <main className='flex-1'>{children}</main>
        <Footer />
      </div>
  );
}
