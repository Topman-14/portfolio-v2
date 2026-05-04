'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cleanErrorMsg } from '@/lib/utils';

export type AdminArticleCommentRow = {
  id: string;
  text: string;
  email: string | null;
  createdAt: string;
};

export function ArticleCommentsPanel({
  comments,
  deleteComment,
}: {
  comments: AdminArticleCommentRow[];
  deleteComment: (commentId: string) => Promise<void>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const runDelete = (commentId: string) => {
    startTransition(async () => {
      try {
        await deleteComment(commentId);
        setConfirmId(null);
        toast.success('Comment deleted.');
        router.refresh();
      } catch (e) {
        toast.error(
          e instanceof Error ? cleanErrorMsg(e) : 'Failed to delete comment.'
        );
      }
    });
  };

  if (comments.length === 0) {
    return (
      <div className='rounded-lg border border-dashed p-6 text-center text-muted-foreground text-sm'>
        No comments on this article yet.
      </div>
    );
  }

  return (
    <>
      <div className='rounded-lg border divide-y'>
        {comments.map((c) => (
          <div key={c.id} className='p-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
            <div className='min-w-0 space-y-1 flex-1'>
              <p className='text-xs text-muted-foreground'>
                {format(new Date(c.createdAt), 'MMM d, yyyy · HH:mm')}
                {c.email ? (
                  <span className='ml-2'>
                    · <span className='font-medium text-foreground'>{c.email}</span>
                  </span>
                ) : (
                  <span className='ml-2'>· no email</span>
                )}
              </p>
              <p className='text-sm whitespace-pre-wrap break-words'>{c.text}</p>
            </div>
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='shrink-0 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10'
              disabled={pending}
              onClick={() => setConfirmId(c.id)}
            >
              <Trash2 className='size-4' />
              Delete
            </Button>
          </div>
        ))}
      </div>

      <AlertDialog open={confirmId !== null} onOpenChange={(open) => !open && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this comment?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. The comment will be removed from the public blog page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={pending}
              className='bg-destructive text-white hover:bg-destructive/90'
              onClick={(e) => {
                e.preventDefault();
                if (confirmId) runDelete(confirmId);
              }}
            >
              {pending ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
