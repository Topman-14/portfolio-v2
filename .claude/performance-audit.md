# Portfolio v2 — Loading & Performance Audit

> Audit date: 2026-05-09 (original) — updated 2026-07-16  
> Branch: feat/ui-fixes  
> Scope: `app/(pages)/(web)` — Home, Blog, Blog Detail, Work, Work Detail

---

## 0. 2026-07-16 session — what shipped, what's left to verify

Plan file this session worked from: `C:\Users\takinkuade\.claude\plans\clever-orbiting-quill.md` (still on disk, full detail there). Everything below is implemented and typecheck/lint-clean unless flagged otherwise. **Next session's job is verification with the MCPs, not more implementation**, unless verification surfaces a regression.

### MCP servers available for verification (`.claude/mcp.json`)
- `next-devtools-mcp` — Next.js-aware DevTools MCP. Use it to inspect the App Router route tree, RSC payloads, and confirm server/client boundary changes (item 4 below) didn't accidentally pull server-only code into a client bundle.
- `mobius-mcp` — browser automation/performance capture. Use it to load pages on `localhost:8080` (run `npm run dev` first) and capture real traces — this session could not do this because neither server was live in-session; **reconnect the MCP client at the start of the next session** if they still don't show up as available tools.

### What shipped this session (all files under the portfolio-v2 repo root)

1. **Navbar reorder bug** — root cause was an unthrottled scroll listener + `DomAnimate` unmounting the nav DOM node every time `isScrolled` flipped near the 100px threshold, racing multiple `SplitType` instances. Fixed in `app/(pages)/(web)/components/navbar.tsx` (throttled scroll handler + hysteresis via `useThrottledCallback`) and `components/animations/dom-animate.tsx` (no longer unmounts, animates opacity/visibility only via `autoAlpha`).
   - **Verify with Mobius**: scroll slowly up/down through 80-100px scrollY on `/` and `/work` at both desktop and mobile viewport emulation — nav items (Home/Blog/Work) should never visually flicker, reorder, or double-render.

2. **PWA double-refresh bug** — `next.config.ts` had `skipWaiting: true` with no client listener, so a new service worker could activate under a tab still running old JS, requiring 1-2 manual refreshes to recover. Added `components/pwa-update-listener.tsx` (listens for `navigator.serviceWorker.oncontrollerchange`, reloads once, guarded by a sessionStorage flag so it can't loop), mounted in `app/layout.tsx`.
   - **Verify**: needs a production build (`npm run build && npm run start`) — service worker only registers in prod (`disable: isDev` in `next.config.ts`). Load the site, deploy a trivial change, rebuild, and confirm the already-open tab self-reloads exactly once instead of needing a manual double-refresh. Hard to verify via MCP tooling alone; likely needs a real deploy cycle.

3. **Spline hero video-bake (mobile/low-end)** — done and live, not just planned:
   - `scripts/bake-spline-video.mjs` (`npm run bake:spline`) drives the locally installed Chrome via `playwright-core` (no browser download) to render `.splinecode` scenes headlessly with a transparent canvas, captures 90 PNG frames at 30fps, and encodes via the bundled `ffmpeg-static` binary (no system ffmpeg needed) to alpha-channel WebM (`libvpx-vp9`, `yuva420p`).
   - Ran successfully this session. Outputs already in `public/3d/`: `hero-mobile.webm` (684KB), `hero-mobile-poster.png`, `sparkles-mobile.webm` (108KB), `sparkles-mobile-poster.png`. Visually confirmed transparent (checked `hero-mobile-poster.png` directly — no matte/box behind the geometry).
   - `components/custom/spline-video.tsx` — new lightweight `<video>` player component, autoplay/muted/loop/playsInline, poster = the baked transparent PNG.
   - Wired into both hero call sites: `app/(pages)/(web)/(landing)/components/hero-scene.tsx` (found this component was **dead code** — the landing hero was actually inline in `(landing)/page.tsx` using `SplinePlayer` directly; fixed by wiring `HeroScene` in properly and deleting the inline duplicate) and `app/(pages)/(web)/work/components/works-hero.tsx`. Both now branch on `useViewport().isMobile`: mobile gets `<SplineVideo>`, desktop keeps the interactive WebGL `SplinePlayer` unchanged.
   - **Known gap**: no `-alpha.mov` (HEVC w/ alpha) exists yet — that encode requires Apple's videotoolbox, only available on macOS ffmpeg builds, not producible on this Windows machine. Until it exists, Safari/iOS silently falls back to the static (but still transparent) poster PNG — correct visually, just not animated on iOS specifically. If a Mac becomes available: rerun `KEEP_FRAMES=1 npm run bake:spline` to keep the PNG sequence in `scripts/.bake-tmp/<scene>/`, then `ffmpeg -framerate 30 -i frame_%04d.png -c:v hevc_videotoolbox -alpha_quality 0.9 -tag:v hvc1 <name>-alpha.mov` and drop the result into `public/3d/`.
   - Also: `components/custom/spline.tsx` — Spline import now `next/dynamic(..., { ssr: false })`, low-end detection widened to also check `navigator.deviceMemory <= 4`.
   - **Verify with Mobius**: load `/` and `/work` with a mobile viewport/UA, confirm the `<video>` element (not a WebGL canvas) is what's rendering, confirm no visible background box/matte over the page's SVG background pattern, and capture a JS main-thread/TBT trace to compare against the WebGL path on desktop — this is the actual perf claim this whole change was for and hasn't been measured yet, only implemented.

4. **Server/Client boundary cleanup** — removed unneeded `'use client'` from `app/(pages)/(web)/layout.tsx` (was pure composition, no hooks/state).
   - **Verify with next-devtools-mcp**: confirm this layout now renders as a Server Component in the route tree and that `Navbar`/`Footer` (which still have their own `'use client'`) are the actual boundary, not the layout itself.

5. **Per-segment loading states** — added `app/(pages)/(web)/blog/[slug]/loading.tsx` and `app/(pages)/(web)/work/[slug]/loading.tsx` (previously only one generic group-level `loading.tsx` existed).
   - **Verify**: hard-load (not client nav) a blog/work detail URL with network throttled and confirm the segment-specific skeleton shows, not the generic pulsing-logo one.

6. **Web Vitals pipeline** — new `WebVitalMetric` Prisma model (`prisma/schema.prisma`), `POST /api/web-vitals` route, `components/web-vitals.tsx` (`useReportWebVitals` + `sendBeacon`) mounted in `app/layout.tsx`, and `app/(pages)/admin/components/web-vitals-section.tsx` (p75 LCP/CLS/INP over the last 7 days via raw `percentile_cont` SQL) rendered on the admin dashboard (`app/(pages)/admin/page.tsx`).
   - **Note on DB**: user ran `prisma migrate dev` then switched to `prisma db push` as their preferred workflow going forward — schema changes for this feature are already applied to the DB (confirmed by user). Don't reintroduce a `migrate dev` step; use `npx prisma db push` for any future schema changes here.
   - **Verify**: browse the live site for a bit (generates real CWV beacons), then check `/admin` for populated LCP/CLS/INP cards instead of "No data". Can also verify via `npx prisma studio` → `web_vital_metrics` table.

7. **Blog search SSR waterfall fix** — `app/(pages)/(web)/blog/page.tsx` now reads `searchParams` and runs the *filtered* Prisma query server-side when `q`/`category` are present (previously always SSR'd the generic unfiltered list, then a client `useQuery` refetch discarded it and showed a spinner). `app/(pages)/(web)/blog/components/browse-blogs.tsx` seeds React Query's cache with `initialData` so a matching first render doesn't refetch. `BlogSearch` now wrapped in its own `<Suspense>` (was previously the only `useSearchParams()` consumer not wrapped).
   - **Verify with Mobius**: hard-navigate directly to `/blog?q=<term>` and confirm the correct filtered results paint immediately with no spinner flash, then type further in either search box and confirm live results still update.

8. **Misc checklist items** — `app/global-error.tsx` added, related-article Prisma queries in blog detail parallelized via `Promise.all`, `@next/bundle-analyzer` installed and wired behind `ANALYZE=true` in `next.config.ts` (run `ANALYZE=true npm run build` to inspect chunks — not run yet this session, worth doing to confirm the Spline dynamic-import actually split the chunk), CSP header added to `next.config.ts`'s `assetHeaders`.

9. **New scripts** — `scripts/backup-db.ts` (`npm run db:backup`, shells out to `pg_dump`, requires PostgreSQL client tools on PATH — not installed on this machine as of this session, user needs to install before first use) and `scripts/bake-spline-video.mjs` (`npm run bake:spline`, see item 3).

### Suggested next-session verification order
1. Reconnect MCP client, confirm `next-devtools-mcp` and `mobius-mcp` tools are actually callable.
2. `npm run dev` on :8080, use Mobius to load `/` and `/work` on a throttled mobile profile, confirm video renders (not WebGL) and capture a trace — this validates the core performance claim.
3. Use Mobius to re-check the navbar scroll fix and the blog search direct-link fix (both above).
4. `ANALYZE=true npm run build` to confirm bundle splitting; check output for Spline/GSAP chunk sizes now vs. what's in this doc's original section 8 concerns.
5. For the PWA double-refresh fix and Safari/iOS alpha-video gap, both need real-device/production testing that MCP browser automation likely can't fully substitute for — flag to the user rather than declaring them verified from MCP output alone.

---

## 1. Root Cause Summary

There are three distinct problems that together create a broken loading experience:

| # | Problem | Root Cause |
|---|---------|-----------|
| 1 | PageLoader dismisses before content is ready | `fadeOut()` fires on `pathname` change, not on content readiness |
| 2 | Navbar links not preloaded on mobile | Links inside NavOverlay are never in the viewport, so Next.js never prefetches them |
| 3 | 3D canvas captures touch events on mobile | SplinePlayer sets `pointer-events: auto` even when the outer wrapper is `pointer-events-none` |

Each section below describes the precise mechanism and a concrete fix.

---

## 2. Issue 1 — PageLoader ↔ Content Sync

### What is broken

`page-loader.tsx` line 111–113:
```ts
useEffect(() => {
  if (!initialLoad) fadeOut();
}, [pathname, searchParams]);
```

The loader dismisses the moment `pathname` changes. In Next.js App Router, `pathname` updates when React **commits** the RSC navigation (i.e. the server-rendered HTML shell is ready). But two things are not yet ready at that point:

- **3D scenes**: `SplinePlayer` fetches `.splinecode` from the network after mount. The home-page canvas is blank for 2–5 seconds after the loader dismisses.
- **Suspense boundaries**: The blog page wraps `BlogBrowseSection` in `<Suspense fallback={<LoadingFallback />}>`. During an RSC navigation transition, React may briefly show the fallback before the client component hydrates — the spinner appears right after the loader disappears.
- **GSAP animations**: `RevealHeader` and other animations depend on fonts being ready (`getFontsReady()`). If they fire before fonts load they either flash or stutter.

### Why it matters

The page loader's entire purpose is to bridge the gap between "the old page" and "the new page being fully ready." If it dismisses too early, the user sees incremental loading inside the new page — exactly the broken experience the loader was meant to hide.

### Fix Plan

#### Step A — Add a `usePageReady` context

Create `context/page-ready.tsx` — a lightweight signal bus:

```ts
// Provides two things:
// 1. signalReady(key: string) — called by components when critical content is loaded
// 2. waitFor(keys: string[]) — called by pages to register which keys must resolve

// PageLoader reads isReady and only calls fadeOut() when true
```

- Keys are strings like `"3d-scene"`, `"content"`, `"images"`
- On route change, all keys reset to pending
- When all registered keys resolve, `isReady` becomes `true`
- Hard timeout of **3 seconds** — if any key hasn't resolved, force-dismiss anyway

#### Step B — Wire SplinePlayer into the context

In `spline.tsx`, call `signalReady("3d-scene")` inside the `handleLoad` callback:

```ts
const handleLoad = (app: any) => {
  // ... existing setup ...
  signalReady("3d-scene");  // new
  onLoad?.(app);
};
```

Until the scene loads, SplinePlayer should show a placeholder (gradient or shimmer) in the container so the layout doesn't shift.

#### Step C — Remove unnecessary Suspense from BlogBrowseSection

`browse-blogs.tsx` already receives `initialBrowseArticles` from SSR and only fetches when `hasFilter === true`. It does **not** suspend on initial render. The `<Suspense>` wrapper in `blog/page.tsx` adds a visible loading flash during client-side navigation for no benefit. Remove the Suspense wrapper.

```tsx
// Before (blog/page.tsx)
<Suspense fallback={<LoadingFallback />}>
  <BlogBrowseSection ... />
</Suspense>

// After — Suspense is not needed here
<BlogBrowseSection ... />
```

#### Step D — Update PageLoader to wait for `isReady`

```ts
// Instead of:
useEffect(() => {
  if (!initialLoad) fadeOut();
}, [pathname, searchParams]);

// Do:
useEffect(() => {
  if (!initialLoad && isReady) fadeOut();
}, [pathname, searchParams, isReady]);
```

On route change, reset the ready state before navigating (in the click handler or in a `useEffect` that fires when pathname is about to change).

---

## 3. Issue 2 — Route Prefetching (Desktop and Mobile)

### What is broken

`navbar.tsx` uses standard `<Link>` with no `prefetch` prop:
```tsx
<Link key={item.href} href={item.href} ...>
```

**Default Next.js App Router behavior**: Links are soft-prefetched when they enter the viewport (via `IntersectionObserver`). On desktop this works fine — the full navbar is always visible.

**On mobile**: The nav links live inside `NavOverlay` (the hamburger drawer). The drawer is `display: none` / hidden until the user taps the menu button. The `IntersectionObserver` never fires, so the routes are never prefetched. The first time a mobile user taps a link, Next.js fetches the RSC payload from scratch — adding 200–800ms of network latency before even showing the loader.

### Fix Plan

#### Option A — `router.prefetch()` in layout (Recommended)

Add a tiny client component to `app/(pages)/(web)/layout.tsx` that fires `router.prefetch()` for all nav routes on mount:

```tsx
// components/prefetch-routes.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { navItems } from '@/config';

export function PrefetchRoutes() {
  const router = useRouter();
  useEffect(() => {
    navItems.forEach(item => router.prefetch(item.href));
  }, [router]);
  return null;
}
```

Add `<PrefetchRoutes />` to the web layout. This runs once on initial page load (regardless of which route the user lands on) and pre-fetches all nav routes. Subsequent navigations will be instant — RSC payload is already in the router cache.

#### Option B — `prefetch={true}` on NavOverlay links

In `nav-overlay.tsx`, ensure all nav links have `prefetch={true}` so Next.js force-prefetches them when the overlay mounts (even if not in the viewport):

```tsx
<Link href={item.href} prefetch={true}>
```

**Combine both options**: `PrefetchRoutes` handles the case where the user never opens the mobile menu, and `prefetch={true}` ensures the overlay's links are also covered.

---

## 4. Issue 3 — 3D Canvas Blocks Mobile Scroll

### What is broken

In `app/(pages)/(web)/(landing)/page.tsx` the SplinePlayer is wrapped in:
```tsx
<div className='... pointer-events-none'>
  <SplinePlayer interactive={true} />
</div>
```

CSS `pointer-events: none` on a parent is **transparent** to pointer events, not blocking — children with `pointer-events: auto` still receive events. SplinePlayer's inner container explicitly sets `pointerEvents: interactive ? 'auto' : 'none'`, so on mobile the Spline canvas **does** capture touch events.

Spline's orbit controls consume `touchmove` events for rotation/pan. When a user swipes up on the hero section, the gesture is consumed by the Spline canvas instead of scrolling the page.

### How to fix — Two-part strategy

#### Part 1 — Disable interactivity on mobile

Pass `interactive` conditionally from the landing page:

```tsx
// In (landing)/page.tsx — import useViewport or detect SSR-safe mobile
import { useIsMobile } from '@/hooks/use-viewport'; // or server-safe check

<SplinePlayer
  scene='/3d/hero.splinecode'
  interactive={!isMobile}   // non-interactive on mobile
  disableZoom={true}
  ...
/>
```

Since the landing page is a Server Component, use a client wrapper or pass a data attribute. The simplest approach: make the SplinePlayer wrapper a small `'use client'` component that reads `useViewport().isMobile` and passes `interactive` accordingly.

On mobile the canvas becomes `pointer-events: none` — scroll events pass through to the page.

#### Part 2 — Add a scroll indicator for mobile hero

When the 3D scene is non-interactive on mobile, add a visible scroll cue in the hero section so users know the page scrolls. This also improves UX on desktop since the hero can feel like a dead-end.

```tsx
// In the hero section, visible only on mobile (md:hidden)
<button
  onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
  className='md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/60 animate-bounce'
  aria-label='Scroll down'
>
  <ChevronDown size={24} />
</button>
```

Position it in the hero section, overlaid above the Spline canvas container.

---

## 5. Page-by-Page Audit

### 5.1 Home (`/`)

**Data strategy**: SSR — fetches `featuredWorks` from Prisma at request time.

| Component | Issue | Fix |
|-----------|-------|-----|
| SplinePlayer (hero) | Blank canvas after loader dismisses | Signal `pageReady("3d-scene")` in `onLoad` + placeholder |
| SplinePlayer (mobile) | Captures touch scroll | Set `interactive={false}` on mobile |
| Gallery images | All use `priority={true}` — fine | No change needed |
| RevealHeader / GSAP | Animations fire before fonts load | Ensure `getFontsReady()` is awaited before initializing GSAP contexts |
| Projects2 | SSR data, renders immediately | No issue |

**Mobile gap**: On mobile, the SplinePlayer is `position: relative` at the bottom of the hero flex column. The hero section can appear to end at the 3D canvas with no scroll affordance. The scroll indicator button (Part 2 above) fixes this.

---

### 5.2 Blog (`/blog`)

**Data strategy**: SSR — `Promise.all()` fetches 4 hero articles, 4 popular, 6 categories, 16 browse articles.

| Component | Issue | Fix |
|-----------|-------|-----|
| BlogBrowseSection | Wrapped in Suspense unnecessarily — shows spinner briefly during nav | Remove `<Suspense>` wrapper |
| BlogSearch | CSR only — rendered client-side, no server fallback | Add an `aria-live` region for a11y; no perf issue |
| BlogHero images | First 4 cards `priority={true}` — correct | No change |
| RevealHeader | GSAP animation | Same font readiness fix as home |

**Why the Suspense flash happens**: When Next.js commits a navigation, React renders the new RSC tree. Even though `BlogBrowseSection` has `initialBrowseArticles`, the Suspense boundary in the parent causes React to render the fallback for one frame before the client component is hydrated. Removing Suspense eliminates the flash.

---

### 5.3 Blog Detail (`/blog/[slug]`)

**Data strategy**: SSG with ISR (`revalidate = 120`).

| Component | Issue | Fix |
|-----------|-------|-----|
| Article content | MDX renders server-side, no loading issue | No change |
| Cover image | `priority` set — correct | No change |
| Related articles | 3 sequential Prisma queries (not parallel) | Wrap in `Promise.all()` — cuts load time by ~60% |
| Comments | Client-fetched on mount — loads after loader | Acceptable; comments are below-fold, not critical |
| Blog engagement bar | Client component | No issue |

**ISR note**: 120s revalidation is aggressive for a personal blog. Consider raising to 3600s (1hr) to reduce cold-start Prisma queries on Vercel.

---

### 5.4 Work (`/work`)

**Data strategy**: SSR — `Promise.all()` fetches featured works, all works, experiences.

| Component | Issue | Fix |
|-----------|-------|-----|
| FeaturedWorks grid | SSR data, renders immediately | No issue |
| ExperienceSection | SSR data | No issue |
| Work card images | Lazy-loaded by default | Consider `priority` for first 3 above-fold cards |
| Mobile scroll | No 3D, no scroll issues | No issue |

---

### 5.5 Work Detail (`/work/[slug]`)

**Data strategy**: SSG, no ISR — fully static at build time.

| Component | Issue | Fix |
|-----------|-------|-----|
| Work content / images | Static, fastest possible | No issue |
| Video (if present) | Loaded on demand | No issue — add `loading="lazy"` if not present |
| No ISR | Work content changes require rebuild | Add `revalidate = 3600` for flexibility |
| Related works (if any) | Verify if sequentially fetched | Check and parallelize if needed |

---

## 6. Implementation Order

Prioritize by user impact. Do these in order:

### Priority 1 — Fix mobile scroll (quick win, no architecture change)

1. Make SplinePlayer wrapper a `'use client'` component in the landing page
2. Use `useViewport().isMobile` to set `interactive={false}` on mobile
3. Add scroll-down chevron button to hero section (mobile only)

**Files**: `app/(pages)/(web)/(landing)/page.tsx`, `components/custom/spline.tsx`

---

### Priority 2 — Remove unnecessary Suspense from blog browse

1. Remove `<Suspense fallback={<LoadingFallback />}>` wrapper from `BlogBrowseSection` in `blog/page.tsx`

**File**: `app/(pages)/(web)/blog/page.tsx`

---

### Priority 3 — Route prefetching

1. Create `components/ui/prefetch-routes.tsx` with `router.prefetch()` for all navItems
2. Add `<PrefetchRoutes />` to `app/(pages)/(web)/layout.tsx`
3. Add `prefetch={true}` to Link in `nav-overlay.tsx`

**Files**: new `components/ui/prefetch-routes.tsx`, `app/(pages)/(web)/layout.tsx`, `nav-overlay.tsx`

---

### Priority 4 — SplinePlayer loading placeholder

1. Add internal `isLoaded` state to SplinePlayer
2. Show a placeholder (dark gradient or animated pulse) until `handleLoad` fires
3. Fade the placeholder out smoothly when scene loads
4. Call `signalReady("3d-scene")` via context once loaded

**File**: `components/custom/spline.tsx`

---

### Priority 5 — PageLoader content-sync (most complex)

1. Create `context/page-ready.tsx` — `PageReadyContext` with `signalReady`, `waitFor`, `isReady`
2. Add to `context/index.tsx` providers
3. Update `page-loader.tsx` to consume context and only `fadeOut()` when `isReady === true`
4. On pathname change, reset ready state
5. Pages register their keys via `usePageReady().waitFor(['3d-scene'])` or `waitFor(['content'])`
6. Add 3s hard timeout to prevent infinite blocking

**Files**: new `context/page-ready.tsx`, `context/index.tsx`, `components/ui/page-loader.tsx`, `components/custom/spline.tsx`

---

### Priority 6 — Parallelise Blog Detail related articles

1. In `app/(pages)/(web)/blog/[slug]/page.tsx`, wrap related article queries in `Promise.all()`

**File**: `app/(pages)/(web)/blog/[slug]/page.tsx`

---

### Priority 7 — ISR housekeeping

1. Add `revalidate = 3600` to Work detail (`/work/[slug]/page.tsx`)
2. Raise Blog detail ISR from 120 → 3600

**Files**: `app/(pages)/(web)/blog/[slug]/page.tsx`, `app/(pages)/(web)/work/[slug]/page.tsx`

---

## 7. Mobile UX Checklist

After implementing the above, verify on a real mobile device (or Chrome DevTools mobile emulation at 375px):

- [ ] Home hero: swiping up scrolls the page, not the 3D scene
- [ ] Home hero: scroll-down chevron is visible below the 3D canvas
- [ ] Navbar: hamburger menu links are prefetched — tapping any link navigates instantly
- [ ] Blog page: navigating from home → blog shows loader then renders complete page (no spinner for browse section)
- [ ] Blog page: images load progressively below the fold, not above it
- [ ] Blog detail: back navigation does not re-fetch (RSC cache hit)
- [ ] Work page: works grid renders without flash
- [ ] All pages: PageLoader does not dismiss until above-fold content is visually complete

---

## 8. Architecture Notes

### Why not `loading.tsx` for full-page skeletons?

`app/(pages)/(web)/loading.tsx` exists as a Suspense fallback for the entire web group. It shows during SSR streaming on initial page load (server-side Suspense). It does **not** show during client-side navigation (the PageLoader handles that). Do not rely on `loading.tsx` for the navigation experience.

### Why not just increase the PageLoader delay?

Adding a hardcoded 2-3s delay before dismissal would mask the problem but create a slow experience on fast networks. The correct fix is to tie dismissal to actual content readiness (Priority 5 above).

### 3D on mobile — why not lazy-load entirely?

Spline scenes are already served via PWA `CacheFirst` (1-year TTL in `next.config.ts`). After the first visit the scene file is in the service worker cache and loads instantly. The issue is not load time but scroll blocking, which is fixed by `interactive={false}` on mobile.
