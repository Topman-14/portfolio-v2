---
name: nextjs-app-code-style
description: Shapes how code is written in this Next.js App Router portfolio—components, hooks, context, and file structure. Use when adding or refactoring UI, blog/work features, client islands, or when the user asks for consistency with project style.
---

# Next.js app code style (portfolio-v2)

## Hooks

- **Extract a custom hook only when it is reused** across routes or features, or when it encapsulates a clearly reusable algorithm (e.g. shared debounce + query pattern documented for multiple pages).
- **Do not** add `useXContext()`-style hooks that exist solely to read one React context used in a single feature. Prefer **props** or **inline `useContext`** at the single call site if context were ever justified.
- **Avoid** “throwaway” abstractions: if logic is used once, keep it in that component.

## Components and files

- **Prefer one primary component per file** (plus types/constants colocated when tiny). If a file exports multiple components, split by default unless they are trivial private fragments (e.g. a single internal helper JSX block not worth naming).
- **Do not** extract a component for a section unless at least one of:
  - it is **reused** in more than one place, or
  - the section has **enough logic** (state, effects, non-trivial handlers) that a named boundary improves readability.
- **Do not** create wrapper components whose only job is passing context into presentational UI without reuse.

## Context and providers

- **Avoid React context** unless:
  - many deeply nested static children need the same frequently updated value **and** prop drilling would be genuinely painful, or
  - a third-party API requires a provider.
- For a **single page** with a few children (e.g. blog search field + list), **prefer one client parent with state and prop drilling** into a small number of child components in separate files.
- **Do not** wrap a server `page.tsx` in a client provider when the same outcome can be achieved with a **single client subtree** that receives server-fetched data as props.

## Next.js alignment (this repo)

- Prefer **server components** for data loading; **client** only for interactivity (search, animations, forms).
- Keep **minimal client boundaries**—avoid pulling large static regions into client just to avoid drilling two or three props.
- Use existing primitives: `@/components/ui/*`, `@/hooks/use-query` where client fetch is required, `@/lib/prismadb` on the server.

## Checklist before adding abstraction

1. Is this hook/component used in **more than one** place (or clearly about to be)? If no, inline or keep in the parent file.
2. Can this be **props from one client parent** instead of context? If yes, use props.
3. Does this deserve its **own file**? If the file would stay under ~80 lines and single-purpose, merging is acceptable; if multiple exports grow, split.

## Anti-patterns (for this project)

- Context + `useBlogSearchContext()` for a single page’s search + list.
- Multiple exported section components in one large `*-client.tsx` without reuse.
- Extracting `SearchField`-sized UI into a folder of wrappers that only forward context.
