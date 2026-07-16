'use client';

import { useEffect } from 'react';

const RELOAD_FLAG = 'pwa-controller-reload';

export function PwaUpdateListener() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    // This mount followed a reload we triggered — consume the flag so the
    // next real controllerchange (a future deploy) can reload again.
    sessionStorage.removeItem(RELOAD_FLAG);

    const handleControllerChange = () => {
      if (sessionStorage.getItem(RELOAD_FLAG)) return;
      sessionStorage.setItem(RELOAD_FLAG, '1');
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
    return () =>
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
  }, []);

  return null;
}
