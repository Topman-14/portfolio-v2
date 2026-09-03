import { Bricolage_Grotesque, Jost, Krona_One } from 'next/font/google';

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

export const jost = Jost({
  variable: '--font-jost',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});