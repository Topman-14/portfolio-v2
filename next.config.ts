import type { NextConfig } from "next";
import withPWA from "next-pwa";
import withBundleAnalyzer from "@next/bundle-analyzer";
import type { RuntimeCaching } from "workbox-build";

const isDev = process.env.NODE_ENV === 'development';

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://images.unsplash.com https://res.cloudinary.com https://*.s3.*.amazonaws.com",
  "media-src 'self'",
  "connect-src 'self' https://res.cloudinary.com https://unpkg.com",
  "worker-src 'self'",
  "frame-ancestors 'none'",
].join('; ');

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
  {
    source: '/:path*',
    headers: [
      {
        key: 'Content-Security-Policy',
        value: csp,
      },
    ],
  },
];

const nextConfig: NextConfig = {
  generateBuildId: async () =>
    process.env.VERCEL_DEPLOYMENT_ID ??
    process.env.CF_PAGES_COMMIT_SHA ??
    process.env.GITHUB_SHA ??
    process.env.BUILD_ID ??
    'development',
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
];

const pwaConfig = withPWA({
  dest: 'public',
  register: !isDev,
  skipWaiting: !isDev,
  disable: isDev,
  buildExcludes: [/middleware-manifest\.json$/],
  runtimeCaching: isDev ? [] : runtimeCaching,
});

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

// @ts-expect-error - next-pwa has incompatible Next.js types
export default bundleAnalyzer(isDev ? nextConfig : pwaConfig(nextConfig));
