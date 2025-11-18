'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { Send } from 'lucide-react';
import GInput from '@/components/ui/ginput';
import { GButton } from '@/components/ui/gbutton';
import { toast } from 'sonner';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter an email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source: 'footer' }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          data?.message || 'Something went wrong. Please try again.';
        toast.error(message);
        return;
      }

      const message = data?.message || 'You are subscribed!';
      toast.success(message);
      setEmail('');
    } catch (error) {
      toast.error((error as Error)?.message || 'Unable to subscribe right now. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
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


