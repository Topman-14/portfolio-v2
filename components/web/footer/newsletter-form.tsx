'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { Send } from 'lucide-react';
import GInput from '@/components/ui/ginput';
import { GButton } from '@/components/ui/gbutton';
import { toast } from 'sonner';
import { useMutate } from '@/hooks/use-mutate';

type NewsletterResponse = {
  message: string;
};



export default function NewsletterForm() {
  const [email, setEmail] = useState('');

  const { mutate: subscribe, isPending: isSubmitting } = useMutate<
    NewsletterResponse
  >('/newsletter', {
    onSuccess: (data) => {
      const message = data?.message || 'You are subscribed!';
      toast.success(message);
      setEmail('');
    },
    onError: (error) => {
      toast.error(
        error?.message || 'Unable to subscribe right now. Please try again later.'
      );
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter an email address.');
      return;
    }

    subscribe({ email, source: 'footer' });
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
        disabled={isSubmitting}
        className='w-full sm:w-auto'
      >
        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        <Send className='w-4 h-4' />
      </GButton>
    </form>
  );
}


