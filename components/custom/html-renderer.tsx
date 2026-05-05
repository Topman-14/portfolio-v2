import { cn } from '@/lib/utils';

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

export const createHtmlRenderData = (content: string) => {
  const seen = new Map<string, number>();
  const toc: TocItem[] = [];

  const html = content.replaceAll(
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

export const HtmlRenderer = ({ html, className }: HtmlRendererProps) => {
  return (
    <article
      className={cn(
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
