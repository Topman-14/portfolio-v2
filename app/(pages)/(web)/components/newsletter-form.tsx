'use client';

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { PartyPopper, Send } from 'lucide-react';
import GInput from '@/components/ui/ginput';
import { GButton } from '@/components/ui/gbutton';
import { toast } from 'sonner';
import { useMutate } from '@/hooks/use-mutate';

type NewsletterResponse = {
  message: string;
};

const SUBSCRIBED_DURATION_MS = 4000;

export default function NewsletterForm({ source = 'footer' }: { source?: string }) {
  const [email, setEmail] = useState('');
  const [justSubscribed, setJustSubscribed] = useState(false);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { mutate: subscribe, isPending: isSubmitting } = useMutate<
    NewsletterResponse
  >('/newsletter', {
    onSuccess: (data) => {
      const message = data?.message || 'You are subscribed!';
      toast.success(message);
      setEmail('');
      setJustSubscribed(true);

      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = setTimeout(() => {
        setJustSubscribed(false);
      }, SUBSCRIBED_DURATION_MS);
    },
    onError: (error) => {
      toast.error(
        error?.message || 'Unable to subscribe right now. Please try again later.'
      );
    },
  });

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter an email address.');
      return;
    }

    subscribe({ email, source });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col sm:flex-row gap-2 sm:items-center'
    >
      <GInput
        type='email'
        value={email}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setEmail(event.target.value)
        }
        placeholder='Enter your email'
        required
      />
      <GButton
        type='submit'
        disabled={isSubmitting || justSubscribed}
        className='w-full sm:w-auto'
      >
        {justSubscribed ? 'Subscribed' : isSubmitting ? 'Subscribing...' : 'Subscribe'}
        {justSubscribed ? (
          <PartyPopper className='w-4 h-4' />
        ) : (
          <Send className='w-4 h-4' />
        )}
      </GButton>
    </form>
  );
}


