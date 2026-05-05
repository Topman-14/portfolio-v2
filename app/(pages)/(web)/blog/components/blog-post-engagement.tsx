'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMutate } from '@/hooks/use-mutate';
import { cn } from '@/lib/utils';

export type BlogCommentPublic = {
  id: string;
  name: string | null;
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
const COMMENTER_NAME_KEY = 'blog_commenter_name';
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
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [email, setEmail] = useState('');
  //I'm too lazy to use react hook form rn, or even the generic form.
  const [commentError, setCommentError] = useState('');
  const { mutateAsync: countRead } = useMutate<ReadResponse, undefined>(
    `/articles/${encodeURIComponent(articleSlug)}/read`,
    { method: 'POST' }
  );
  const { mutateAsync: postComment, isPending: submitting } = useMutate<
    PostCommentResponse,
    { name: string; text: string; email?: string }
  >(`/articles/${encodeURIComponent(articleSlug)}/comments`, { method: 'POST' });

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  useEffect(() => {
    try {
      const stored = globalThis.localStorage.getItem(COMMENTER_NAME_KEY);
      if (stored) setName(stored);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (cancelled) return;
      try {
        const data = await countRead(undefined);
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
  }, [countRead, router]);

  const submitComment = useCallback(async () => {
    const trimmedName = name.trim();
    const trimmed = text.trim();
    setCommentError('');
    if (!trimmedName) {
      setCommentError('Please enter your name.');
      return;
    }
    if (!trimmed) {
      setCommentError('Please write a comment.');
      return;
    }
    try {
      const data = await postComment({
        name: trimmedName,
        text: trimmed,
        email: email.trim() || undefined,
      });
      if (data.comment) {
        try {
          globalThis.localStorage.setItem(COMMENTER_NAME_KEY, trimmedName);
        } catch {
          /* ignore */
        }
        setText('');
        setEmail('');
        toast.success('Thanks — your comment is live.');
        router.refresh();
      }
    } catch (error) {
      setCommentError(error instanceof Error ? error.message : 'Something went wrong. Try again.');
    }
  }, [name, text, email, router, postComment]);

  return (
    <div className='space-y-10 border-t border-white/10 pt-10'>
      <div className='space-y-6'>
        <h2 className='text-2xl md:text-3xl font-display font-bold text-white px-4 md:px-0'>
          Comments
        </h2>

        {comments.length === 0 ? (
          <p className='text-white/65 font-sans text-sm px-4 md:px-0'>
            No comments yet. Be the first to share your thoughts.
          </p>
        ) : (
          <ul className='space-y-6 px-4 md:px-0'>
            {comments.map((c) => (
              <li
                key={c.id}
                className='rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:p-5'
              >
                <p className='text-xs text-white/50 font-sans mb-2'>
                  <span className='text-white/75 font-medium'>
                    {c.name?.trim() || 'Anonymous'}
                  </span>
                  {' · '}
                  {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                </p>
                <p className='text-white/90 font-sans text-sm md:text-base whitespace-pre-wrap leading-relaxed'>
                  {c.text}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className='md:rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6 flex flex-col gap-4'>
          <p className='font-display text-lg text-white'>Add a comment</p>
          <div className='space-y-2'>
            <Label htmlFor={`comment-name-${articleId}`} className='text-white/80 font-sans'>
              Name
            </Label>
            <Input
              id={`comment-name-${articleId}`}
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              className={cn('font-sans', fieldClass)}
              placeholder='Your name'
              maxLength={120}
              autoComplete='name'
            />
          </div>
          <div className='space-y-2'>
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
              <p className='text-xs text-white/55 font-sans leading-relaxed max-w-lg'>
                If you add an email, only Tope will see it so he can reply if needed. <br /> It is not shown on this page or shared publicly.
              </p>
            </div>
            <Label htmlFor={`comment-text-${articleId}`} className='text-white/80 font-sans'>
              Comment
            </Label>
            <Textarea
              id={`comment-text-${articleId}`}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (commentError) setCommentError('');
              }}
              disabled={submitting}
              className={cn('min-h-[120px] md:min-h-[140px] font-sans', fieldClass)}
              placeholder='Write your comment…'
              maxLength={4000}
            />
            {commentError ? (
              <p className='text-sm text-red-400 font-sans'>{commentError}</p>
            ) : null}
          </div>

          <Button
            type='button'
            variant='outline'
            className='border-malachite/40 bg-malachite/10 text-white hover:bg-malachite/20 hover:text-white ml-auto'
            disabled={submitting}
            onClick={() => void submitComment()}
            loading={submitting}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}
