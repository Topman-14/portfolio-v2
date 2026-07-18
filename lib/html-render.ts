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
