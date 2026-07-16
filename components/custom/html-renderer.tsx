'use client';

import { cn } from '@/lib/utils';
import type { MouseEvent } from 'react';

export type TocItem = {
  id: string;
  label: string;
  level: 2 | 3;
};

const stripHtml = (value: string) =>
  value.replaceAll(/<[^>]+>/g, '').replaceAll(/\s+/g, ' ').trim();

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replaceAll('&amp;', 'and')
    .replaceAll(/[^a-z0-9\s-]/g, '')
    .trim()
    .replaceAll(/\s+/g, '-');

const COPY_ICON = '<svg class="icon-copy" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
const CHECK_ICON = '<svg class="icon-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

const addCodeCopyButtons = (content: string) =>
  content.replaceAll(
    /<pre([^>]*)>([\s\S]*?)<\/pre>/gi,
    (match, attrs, body) =>
      `<div class="code-block relative group/code"><pre${attrs}>${body}</pre><button type="button" data-copy-btn class="copy-code-btn absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded-md border border-white/15 bg-white/5 text-white/70 opacity-0 group-hover/code:opacity-100 hover:text-malachite hover:border-malachite/40 transition-colors" aria-label="Copy code">${COPY_ICON}${CHECK_ICON}</button></div>`
  );

export const createHtmlRenderData = (content: string) => {
  const seen = new Map<string, number>();
  const toc: TocItem[] = [];

  const html = addCodeCopyButtons(content).replaceAll(
    /<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi,
    (match, tag, attrs, body) => {
      const label = stripHtml(body);
      if (!label) return match;

      if (/\sid=/.test(attrs)) {
        const idMatch = attrs.match(/\sid=["']([^"']+)["']/i);
        if (idMatch?.[1]) {
          toc.push({
            id: idMatch[1],
            label,
            level: tag.toLowerCase() === 'h2' ? 2 : 3,
          });
        }
        return match;
      }

      const base = slugify(label) || 'section';
      const count = seen.get(base) || 0;
      seen.set(base, count + 1);
      const id = count === 0 ? base : `${base}-${count + 1}`;

      toc.push({
        id,
        label,
        level: tag.toLowerCase() === 'h2' ? 2 : 3,
      });

      return `<${tag}${attrs} id="${id}">${body}</${tag}>`;
    }
  );

  return { html, toc };
};

type HtmlRendererProps = {
  html: string;
  className?: string;
};

const handleCopyClick = (e: MouseEvent<HTMLElement>) => {
  const button = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-copy-btn]');
  if (!button) return;

  const code = button.previousElementSibling?.textContent ?? '';
  navigator.clipboard.writeText(code).then(() => {
    button.setAttribute('data-copied', 'true');
    window.setTimeout(() => button.removeAttribute('data-copied'), 2000);
  });
};

export const HtmlRenderer = ({ html, className }: HtmlRendererProps) => {
  return (
    <article
      onClick={handleCopyClick}
      className={cn(
        '[&_.code-block]:relative',
        '[&_.copy-code-btn_.icon-check]:hidden',
        '[&_.copy-code-btn[data-copied]_.icon-copy]:hidden',
        '[&_.copy-code-btn[data-copied]_.icon-check]:block',
        '[&_.copy-code-btn[data-copied]]:text-malachite [&_.copy-code-btn[data-copied]]:border-malachite/40 [&_.copy-code-btn[data-copied]]:opacity-100',
        'md:rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 md:p-10 text-white/85 font-sans leading-relaxed',
        '[&_h1]:text-3xl [&_h1]:md:text-4xl [&_h1]:font-display [&_h1]:font-bold [&_h1]:text-white [&_h1]:mt-8 [&_h1]:mb-4',
        '[&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:scroll-mt-24',
        '[&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-display [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-7 [&_h3]:mb-3 [&_h3]:scroll-mt-24',
        '[&_p]:text-white/80 [&_p]:mb-4',
        '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mb-4',
        '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:mb-4',
        '[&_blockquote]:border-l-2 [&_blockquote]:border-malachite [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-white/70 [&_blockquote]:my-6',
        '[&_a]:text-malachite [&_a]:underline [&_a]:underline-offset-4',
        '[&_img]:rounded-2xl [&_img]:my-6',
        '[&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-white',
        '[&_pre]:bg-coal/80 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-5 [&_pre_code]:bg-transparent [&_pre_code]:p-0',
        '[&_table]:w-full [&_table]:max-w-full [&_table]:table-fixed [&_table]:border-collapse [&_table]:my-6 [&_table]:border [&_table]:border-white/20',
        '[&_th]:border [&_th]:border-white/20 [&_th]:bg-white/10 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-white [&_th]:align-top [&_th]:break-words [&_th]:min-w-0',
        '[&_td]:border [&_td]:border-white/20 [&_td]:px-3 [&_td]:py-2 [&_td]:align-top [&_td]:break-words [&_td]:min-w-0 [&_td]:[overflow-wrap:anywhere]',
        '[&_.tiptap-embed]:relative [&_.tiptap-embed]:my-6 [&_.tiptap-embed]:aspect-video [&_.tiptap-embed]:w-full [&_.tiptap-embed]:max-w-full [&_.tiptap-embed]:overflow-hidden [&_.tiptap-embed]:rounded-2xl [&_.tiptap-embed]:border [&_.tiptap-embed]:border-white/10',
        '[&_.tiptap-embed_iframe]:absolute [&_.tiptap-embed_iframe]:inset-0 [&_.tiptap-embed_iframe]:size-full [&_.tiptap-embed_iframe]:border-0',
        '[&_iframe]:my-6 [&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:max-w-full [&_iframe]:rounded-2xl [&_iframe]:border [&_iframe]:border-white/10',
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
