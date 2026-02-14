import { cn } from '@/lib/utils';
import Logo from './logo';
import { Suspense as ReactSuspense } from 'react';


type LoadingFallbackProps = {
  className?: string;
};

export const LoadingFallback = ({
  className,
}: LoadingFallbackProps) => {
  return (
    <div className={cn('flex justify-center items-center p-4 h-40', className)}>
        <Logo className='animate-pulse' color='white' />
    </div>
  );
};

export const Suspense =({ children }: { children: React.ReactNode }) => {
  return (
    <ReactSuspense fallback={<LoadingFallback />}>
      {children}
    </ReactSuspense>
  );
};