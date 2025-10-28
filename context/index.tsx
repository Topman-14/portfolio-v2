import { ThemeProvider } from './theme';
import { Toaster } from '@/components/ui/sonner';
import NextTopLoader from 'nextjs-toploader';
import { AlertProvider } from '@/context/alert';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      <NextTopLoader
        color='#14cc5e'
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
        showSpinner={false}
        easing='ease'
        speed={200}
        shadow='0 0 10px #2299DD,0 0 5px #2299DD'
      />
      <AlertProvider>
        {children}
        <Toaster position='top-center' richColors />
      </AlertProvider>
    </ThemeProvider>
  );
}
