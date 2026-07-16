'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang='en'>
      <body className='min-h-screen flex items-center justify-center bg-black text-white'>
        <div className='text-center space-y-4 px-6'>
          <h1 className='text-3xl font-bold'>Something went wrong</h1>
          <p className='text-white/60'>An unexpected error occurred. Please try again.</p>
          <button
            onClick={() => reset()}
            className='inline-flex items-center rounded-full bg-malachite px-5 py-2 text-black font-medium hover:opacity-90 transition-opacity'
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
