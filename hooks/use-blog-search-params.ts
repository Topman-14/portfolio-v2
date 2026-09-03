'use client';

import { useCallback, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export type BlogSearchParamPatch = {
  q?: string | null;
  category?: string | null;
};

function buildBlogSearchHref(
  pathname: string,
  current: { q: string; category: string },
  patch: BlogSearchParamPatch
) {
  const p = new URLSearchParams();
  const q = patch.q !== undefined ? patch.q?.trim() ?? '' : current.q;
  const category =
    patch.category !== undefined ? patch.category?.trim() ?? '' : current.category;

  if (q) p.set('q', q);
  if (category) p.set('category', category);

  const qs = p.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

const BROWSE_SECTION_ID = 'browse-all';

export function useBlogSearchParams(current: { q: string; category: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const replace = useCallback(
    (patch: BlogSearchParamPatch) => {
      startTransition(() => {
        router.replace(buildBlogSearchHref(pathname, current, patch), { scroll: false });
      });
    },
    [pathname, router, current]
  );

  const toggleCategory = useCallback(
    (id: string) => {
      replace({ category: current.category === id ? null : id });
    },
    [replace, current.category]
  );

  const commitQToUrlAndScrollToBrowse = useCallback(
    (raw?: string) => {
      if (raw !== undefined) {
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
    replace,
    toggleCategory,
    commitQToUrlAndScrollToBrowse,
    isPending,
  };
}
