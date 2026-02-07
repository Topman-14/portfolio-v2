import NavRoutes from './nav-routes';
import { AuthButton } from '../../../../components/ui/auth-button';
import { ModeToggle } from '../../../../components/ui/theme-toggle';
import Logo from '../../../../components/ui/logo';

export default function navbar() {
  return (
    <div className='border-b md:px-8'>
      <div className='flex h-16 items-center px-4 gap-4'>
        <Logo link />
        <NavRoutes />
        <div className='ml-auto flex items-center gap-2'>
          <ModeToggle />
          <AuthButton />
        </div>
      </div>
    </div>
  );
}
