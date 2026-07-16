export default function BlogDetailLoading() {
  return (
    <main className='bg2 min-h-screen pb-24 pt-10 md:pb-28 animate-pulse'>
      <div className='max-w-[1500px] mx-auto space-y-14 md:px-8 lg:px-12'>
        <div className='h-5 w-32 rounded bg-white/10 ml-4 md:ml-0' />

        <section className='md:rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 lg:p-10'>
          <div className='grid grid-cols-1 xl:grid-cols-[1fr_620px] gap-8 xl:gap-12 items-stretch'>
            <div className='space-y-5 my-auto'>
              <div className='h-4 w-40 rounded bg-white/10' />
              <div className='h-12 w-full rounded bg-white/10' />
              <div className='h-4 w-3/4 rounded bg-white/10' />
            </div>
            <div className='min-h-[300px] md:min-h-[380px] rounded-2xl bg-white/10' />
          </div>
        </section>

        <section className='grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-10'>
          <aside className='hidden lg:block'>
            <div className='h-48 rounded-2xl bg-white/5' />
          </aside>
          <div className='min-w-0 space-y-4'>
            <div className='h-4 w-full rounded bg-white/10' />
            <div className='h-4 w-full rounded bg-white/10' />
            <div className='h-4 w-2/3 rounded bg-white/10' />
          </div>
        </section>
      </div>
    </main>
  );
}
