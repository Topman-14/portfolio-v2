'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { isDev } from '@/lib/utils';

export function WebVitals() {
  useReportWebVitals((metric) => {
    if (isDev) return;

    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      path: window.location.pathname,
      navigationType: metric.navigationType,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/web-vitals', body);
    } else {
      fetch('/api/web-vitals', { body, method: 'POST', keepalive: true });
    }
  });

  return null;
}
