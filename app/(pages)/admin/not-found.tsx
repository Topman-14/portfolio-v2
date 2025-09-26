import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react';
import { LottiePlayer } from '@/components/custom/lottie-player';

export default function NotFound() {
  return (
    <div className='flex items-center justify-center text-center flex-col size-full'>
      <LottiePlayer src='/img/lottie/not-found.lottie' loop autoplay height={300} width={300} className='xl:w-[650px] md:w-[500px] w-[300px] xl:-my-20' />
      <h1 className='text-2xl font-bold mb-4'>Page Not Found</h1>
      <Link href='/admin'>
        <Button className='font-semibold'>
          <LayoutDashboard className='mb-0.5'/> Dashboard 
        </Button>

      </Link>
    </div>
  );
}
