import Navbar from '@/app/(pages)/admin/components/navbar';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { routes } from '@/lib/constants';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user) {
    redirect(routes.signIn);
  }

  const userRole = session.user.role;
  if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
    redirect(routes.signIn);
  }

  return (
    <SessionProvider>
      <div className='min-h-screen bg-background'>
        <Navbar />
        {children}
      </div>
    </SessionProvider>
  );
}
