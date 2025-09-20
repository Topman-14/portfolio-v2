import { Bricolage_Grotesque, Krona_One, Syne } from 'next/font/google';

export const bricolageGrotesque = Bricolage_Grotesque({
  variable: '--font-bricolage-grotesque',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
});

export const kronaOne = Krona_One({
  variable: '--font-krona-one',
  subsets: ['latin'],
  weight: '400',
});

export const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});