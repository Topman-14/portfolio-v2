import type { NextConfig } from "next";
import withPWA from "next-pwa";
import type { RuntimeCaching } from "workbox-build";

const isDev = process.env.NODE_ENV === 'development';

const assetHeaders = [
  {
    source: '/_next/static/:path*',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable',
      },
    ],
  },
  {
    source: '/img/:path*',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable',
      },
    ],
  },
  {
    source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|woff|woff2|ttf|eot)',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable',
      },
    ],
  },
  {
    source: '/3d/:path*',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable',
      },
    ],
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
      },
    ],
  },
  async headers() {
    return isDev ? [] : assetHeaders;
  },
};

const runtimeCaching: RuntimeCaching[] = [
  {
    urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'google-fonts',
      expiration: {
        maxEntries: 4,
        maxAgeSeconds: 365 * 24 * 60 * 60,
      },
    },
  },
  {
    urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|avif)$/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'imageCache',
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: 365 * 24 * 60 * 60,
      },
    },
  },
  {
    urlPattern: /\.(?:js|css|woff|woff2|ttf|eot|otf)$/,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'staticCache',
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: 365 * 24 * 60 * 60,
      },
    },
  },
  {
    urlPattern: /\/_next\/static\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'nextStatic',
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: 365 * 24 * 60 * 60,
      },
    },
  },
  {
    urlPattern: /\/_next\/image\?url=.+$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'nextImage',
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      },
    },
  },
  {
    urlPattern: ({ request }: { request: Request }) => request.destination === 'document',
    handler: 'NetworkFirst',
    options: {
      cacheName: 'pagesCache',
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60,
      },
      networkTimeoutSeconds: 10,
    },
  },
  {
    urlPattern: ({ request }: { request: Request }) => request.mode === 'navigate',
    handler: 'NetworkFirst',
    options: {
      cacheName: 'navigateCache',
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60,
      },
      networkTimeoutSeconds: 10,
    },
  },
  {
    urlPattern: /^https?.*/,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'offlineCache',
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      },
      networkTimeoutSeconds: 15,
    },
  },
];

const pwaConfig = withPWA({
  dest: 'public',
  register: !isDev,
  skipWaiting: !isDev,
  disable: isDev,
  buildExcludes: [/middleware-manifest\.json$/],
  runtimeCaching: isDev ? [] : runtimeCaching,
});

// @ts-expect-error - next-pwa has incompatible Next.js types
export default isDev ? nextConfig : pwaConfig(nextConfig);
