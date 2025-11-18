'use client';

import Navbar from '@/components/web/navbar';
import Footer from '@/components/web/footer';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';

export default function WebLayout({ children }: { children: React.ReactNode }) {
  useSmoothScroll();

  return (
    <>
      <div className='min-h-screen flex flex-col'>
        <Navbar />
        <main className='flex-1'>{children}</main>
        <Footer />
      </div>
    </>
  );
}
