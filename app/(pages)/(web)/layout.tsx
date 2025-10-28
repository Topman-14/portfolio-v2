import Navbar from '@/components/web/navbar';
import Footer from '@/components/web/footer';
import PageLoader from '@/components/ui/page-loader';

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageLoader />
      <div className='min-h-screen flex flex-col'>
        <Navbar />
        <main className='flex-1'>{children}</main>
        <Footer />
      </div>
    </>
  );
}
