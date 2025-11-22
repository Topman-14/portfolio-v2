import { NextResponse } from 'next/server';
import { getNowPlaying, SpotifyData } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await getNowPlaying();

    if (response.status === 204 || response.status > 400) {
      return NextResponse.json<SpotifyData>({ isPlaying: false });
    }

    const song = await response.json();

    if (!song.item) {
      return NextResponse.json<SpotifyData>({ isPlaying: false });
    }

    const isPlaying = song.is_playing;
    const title = song.item.name;
    const artist = song.item.artists.map((artist: { name: string }) => artist.name).join(', ');
    const album = song.item.album.name;
    const albumImageUrl = song.item.album.images[0]?.url;
    const songUrl = song.item.external_urls.spotify;

    return NextResponse.json<SpotifyData>({
      isPlaying,
      title,
      artist,
      album,
      albumImageUrl,
      songUrl,
    });
  } catch (error) {
    console.error('Error fetching Spotify data:', error);
    return NextResponse.json<SpotifyData>({ isPlaying: false });
  }
}

