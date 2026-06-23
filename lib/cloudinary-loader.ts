type LoaderParams = {
  src: string;
  width: number;
  quality?: number;
};

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_ORIGIN = 'res.cloudinary.com';

export default function cloudinaryLoader({ src, width, quality }: LoaderParams): string {
  // Only transform Cloudinary URLs — pass everything else through as-is
  if (!src.includes(CLOUDINARY_ORIGIN)) {
    return src;
  }

  const q = quality ?? 75;

  // src is already a full Cloudinary URL — extract the upload path after /upload/
  // e.g. https://res.cloudinary.com/doaq5feum/image/upload/v123/photo.jpg
  // → inject f_auto,q_auto:good,w_<width> transformation
  const uploadIndex = src.indexOf('/upload/');
  if (uploadIndex === -1) return src;

  const base = src.slice(0, uploadIndex + 8); // includes /upload/
  const rest = src.slice(uploadIndex + 8);

  // Strip any existing version segment (v followed by digits) so we don't double it
  const withoutVersion = rest.replace(/^v\d+\//, '');

  return `${base}f_auto,q_auto:${qualityLabel(q)},w_${width}/${withoutVersion}`;
}

function qualityLabel(q: number): string {
  if (q >= 90) return 'best';
  if (q >= 75) return 'good';
  if (q >= 50) return 'eco';
  return 'low';
}
