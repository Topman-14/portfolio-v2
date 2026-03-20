import Logo from '@/components/ui/logo';
import { cn } from '@/lib/utils';

export default function WebLoading() {
  return (
    <div
      className={cn(
        'flex min-h-[50vh] flex-1 flex-col items-center justify-center px-4 py-24'
      )}
    >
      <Logo className='animate-pulse' color='white' />
    </div>
  );
}
