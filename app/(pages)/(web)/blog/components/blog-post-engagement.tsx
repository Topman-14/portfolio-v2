'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export type BlogCommentPublic = {
  id: string;
  text: string;
  createdAt: string;
};

type ReadResponse = {
  counted: boolean;
  reads: number;
};

type PostCommentResponse = {
  comment: BlogCommentPublic;
};

const READ_DELAY_MS = 4500;
const fieldClass =
  'border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-malachite/50 focus-visible:ring-malachite/20';

export function BlogPostEngagement({
  articleSlug,
  articleId,
  initialComments,
}: {
  articleSlug: string;
  articleId: string;
  initialComments: BlogCommentPublic[];
}) {
  const router = useRouter();
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (cancelled) return;
      try {
        const res = await fetch(`/api/articles/${encodeURIComponent(articleSlug)}/read`, {
          method: 'POST',
        });
        if (!res.ok) return;
        const data = (await res.json()) as ReadResponse;
        if (cancelled) return;
        if (data.counted) {
          router.refresh();
        }
      } catch {
        /* ignore */
      }
    }, READ_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [articleSlug, router]);

  const submitComment = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      toast.error('Please write a comment.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/articles/${encodeURIComponent(articleSlug)}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: trimmed,
          email: email.trim() || undefined,
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(typeof payload.message === 'string' ? payload.message : 'Could not post comment.');
        return;
      }
      const data = payload as PostCommentResponse;
      if (data.comment) {
        setText('');
        setEmail('');
        toast.success('Thanks — your comment is live.');
        router.refresh();
      }
    } catch {
      toast.error('Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  }, [articleSlug, text, email, router]);

  return (
    <div className='space-y-10 border-t border-white/10 pt-10'>
      <div className='space-y-6'>
        <h2 className='text-2xl md:text-3xl font-display font-bold text-white'>
          Comments
        </h2>

        {comments.length === 0 ? (
          <p className='text-white/65 font-sans text-sm'>
            No comments yet. Be the first to share your thoughts.
          </p>
        ) : (
          <ul className='space-y-6'>
            {comments.map((c) => (
              <li
                key={c.id}
                className='rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:p-5'
              >
                <p className='text-xs text-white/50 font-sans mb-2'>
                  {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                </p>
                <p className='text-white/90 font-sans text-sm md:text-base whitespace-pre-wrap leading-relaxed'>
                  {c.text}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className='rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6 flex flex-col gap-4'>
          <p className='font-display text-lg text-white'>Add a comment</p>
          <div className='space-y-2'>
            <Label htmlFor={`comment-text-${articleId}`} className='text-white/80 font-sans'>
              Comment
            </Label>
            <Textarea
              id={`comment-text-${articleId}`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={submitting}
              className={cn('min-h-[120px] md:min-h-[140px] font-sans', fieldClass)}
              placeholder='Write your comment…'
              maxLength={4000}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor={`comment-email-${articleId}`} className='text-white/80 font-sans'>
              Email (optional)
            </Label>
            <Input
              id={`comment-email-${articleId}`}
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              className={cn('font-sans', fieldClass)}
              placeholder='you@example.com'
              autoComplete='email'
            />
            <p className='text-xs text-white/55 font-sans leading-relaxed max-w-xl'>
              If you add an email, only Tope will see it so he can reply if needed. It is not shown on this page or shared publicly.
            </p>
          </div>
          <Button
            type='button'
            variant='outline'
            className='border-malachite/40 bg-malachite/10 text-white hover:bg-malachite/20 hover:text-white ml-auto'
            disabled={submitting}
            onClick={() => void submitComment()}
          >
            {submitting ? (
              <>
                <Loader2 className='size-4 animate-spin' />
                Posting…
              </>
            ) : (
              'Post comment'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
