export default function WorkDetailLoading() {
  return (
    <main className='bg2 min-h-screen pb-24 pt-10 md:pb-28 animate-pulse'>
      <div className='max-w-[1500px] mx-auto space-y-14 md:px-8 lg:px-12'>
        <div className='h-5 w-32 rounded bg-white/10 ml-4 md:ml-0' />

        <section className='space-y-6'>
          <div className='h-4 w-40 rounded bg-white/10' />
          <div className='h-12 w-2/3 rounded bg-white/10' />
          <div className='min-h-[320px] md:min-h-[420px] rounded-2xl bg-white/10' />
        </section>

        <section className='space-y-4'>
          <div className='h-4 w-full rounded bg-white/10' />
          <div className='h-4 w-full rounded bg-white/10' />
          <div className='h-4 w-2/3 rounded bg-white/10' />
        </section>
      </div>
    </main>
  );
}
