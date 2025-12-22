'use client'
import { cn } from '@/lib/utils'
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Fragment } from 'react';
import { AdminNavRoutes } from '@/lib/constants';


export default function NavRoutes({
    className,
    ...props
    } : React.HTMLAttributes<HTMLElement>){
      const pathname = usePathname();

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden py-0 px-2 mx-2">
            <Menu className="size-5"/>
          </Button>
        </SheetTrigger>
        <SheetContent side={'right'}>
          <SheetHeader>
            <SheetTitle>
              Menu
            </SheetTitle>
          </SheetHeader>
          <div className='flex flex-col gap-5 text-right mt-8 px-4'>
              {AdminNavRoutes.map((route) => (
                <Fragment key={route.href}>
                    <Link 
                      href={route.href}
                      className={cn('text-sm font-medium transition-colors hover:text-primary', 
                      pathname.startsWith(route.href) ? 'text-primary font-bold dark:text-white' : 'text-muted-foreground')}
                      >
                        <SheetClose className='text-right w-full'>
                          {route.label}
                        </SheetClose>
                    </Link>
                  <Separator />
                </Fragment>
            ))}
          </div>
        </SheetContent>
        <SheetDescription className='hidden'>Menu</SheetDescription>
      </Sheet>
      <nav
        className={cn("hidden item-center space-x-4 lg:space-x-6 lg:flex", className)}
      >
        {AdminNavRoutes.map((route) => (
          <Link 
            href={route.href}
            key={route.href}
            className={cn('text-sm font-medium transition-colors hover:text-primary', 
            pathname.startsWith(route.href) ? 'text-primary font-bold dark:text-white' : 'text-muted-foreground')}
            >
              {route.label}
          </Link>
        ))}
      </nav>
    </>
  )
}