'use client';

import { useCallback, useRef, useState } from 'react';

export function useCopy(resetDelay = 2000) {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setIsCopied(false), resetDelay);
      } catch {
        /* clipboard unavailable */
      }
    },
    [resetDelay]
  );

  return { isCopied, copy };
}
