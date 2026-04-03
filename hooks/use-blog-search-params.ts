'use client';

import { useCallback, useMemo, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export type BlogSearchParamPatch = {
  q?: string | null;
  category?: string | null;
};

function replaceBlogSearchParams(
  pathname: string,
  current: URLSearchParams,
  patch: BlogSearchParamPatch,
  replace: (href: string, options?: { scroll?: boolean }) => void
) {
  const p = new URLSearchParams(current.toString());
  if (patch.q !== undefined) {
    const v = patch.q?.trim() ?? '';
    if (v) p.set('q', v);
    else p.delete('q');
  }
  if (patch.category !== undefined) {
    const v = patch.category?.trim() ?? '';
    if (v) p.set('category', v);
    else p.delete('category');
  }
  const qs = p.toString();
  replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
}

const BROWSE_SECTION_ID = 'browse-all';

export function useBlogSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paramsRef = useRef(searchParams);
  paramsRef.current = searchParams;

  const paramsString = searchParams.toString();

  const q = useMemo(() => {
    return new URLSearchParams(paramsString).get('q')?.trim() ?? '';
  }, [paramsString]);

  const category = useMemo(() => {
    return new URLSearchParams(paramsString).get('category')?.trim() ?? '';
  }, [paramsString]);

  const hasFilter = q.length > 0 || category.length > 0;

  const apiQueryParams = useMemo(
    () =>
      hasFilter
        ? {
            ...(q ? { q } : {}),
            ...(category ? { category } : {}),
            limit: 48,
          }
        : undefined,
    [hasFilter, q, category]
  );

  const replace = useCallback(
    (patch: BlogSearchParamPatch) => {
      replaceBlogSearchParams(
        pathname,
        new URLSearchParams(paramsRef.current.toString()),
        patch,
        router.replace
      );
    },
    [pathname, router]
  );

  const toggleCategory = useCallback(
    (id: string) => {
      const current = paramsRef.current.get('category')?.trim() ?? '';
      replace({ category: current === id ? null : id });
    },
    [replace]
  );

  const commitQToUrlAndScrollToBrowse = useCallback(
    (raw?: string) => {
      if (raw) {
        replace({ q: raw.trim() || null });
      }
      queueMicrotask(() => {
        document
          .getElementById(BROWSE_SECTION_ID)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    },
    [replace]
  );

  return {
    q,
    category,
    hasFilter,
    paramsString,
    apiQueryParams,
    replace,
    toggleCategory,
    commitQToUrlAndScrollToBrowse,
  };
}
