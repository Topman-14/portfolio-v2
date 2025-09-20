import NavRoutes from './nav-routes';
import { AuthButton } from '../ui/auth-button';
import { ModeToggle } from '../ui/theme-toggle';

export default function navbar() {
  return (
    <div className='border-b md:px-8'>
      <div className='flex h-16 items-center px-4'>
        <NavRoutes />
        <div className='ml-auto flex items-center gap-2'>
          <ModeToggle />
          <AuthButton />
        </div>
      </div>
    </div>
  );
}
