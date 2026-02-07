'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Music } from 'lucide-react';
import type { SpotifyData } from '@/lib/spotify';

export const SpotifyNowPlaying = () => {
  const [data, setData] = useState<SpotifyData>({ isPlaying: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch('/api/spotify');
        const spotifyData = await response.json();
        setData(spotifyData);
      } catch (error) {
        console.error('Failed to fetch Spotify data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className='w-full h-full flex items-center justify-center bg-[#1DB954]/10 backdrop-blur-sm'>
        <Music className='w-8 h-8 text-[#1DB954] animate-pulse' />
      </div>
    );
  }

  if (!data.isPlaying) {
    return (
      <div className='w-full h-full flex flex-col items-center justify-center bg-[#1DB954]/10 backdrop-blur-sm p-4 gap-3'>
        <Music className='w-8 h-8 text-[#1DB954]' />
        <p className='text-white/60 text-xs text-center font-sans'>Not playing</p>
      </div>
    );
  }

  return (
    <a
      href={data.songUrl}
      target='_blank'
      rel='noopener noreferrer'
      className='w-full h-full flex flex-col bg-[#1DB954]/10 backdrop-blur-sm hover:bg-[#1DB954]/20 transition-colors duration-300 overflow-hidden group'
    >
      <div className='relative flex-1 overflow-hidden'>
        {data.albumImageUrl && (
          <Image
            src={data.albumImageUrl}
            alt={data.album || 'Album art'}
            fill
            className='object-cover group-hover:scale-105 transition-transform duration-500'
          />
        )}
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent' />
        
        <div className='absolute top-2 right-2 bg-[#1DB954] rounded-full p-1.5 shadow-lg'>
          <Music className='w-3 h-3 text-black animate-pulse' />
        </div>
      </div>

      <div className='p-3 space-y-1'>
        <p className='text-white text-xs font-semibold truncate font-sans'>
          {data.title}
        </p>
        <p className='text-white/60 text-[10px] truncate font-sans'>
          {data.artist}
        </p>
      </div>
    </a>
  );
};

