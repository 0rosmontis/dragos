'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { registerUserAction } from '@/app/(auth)/sign-up/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

type SignUpValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values: SignUpValues) => {
    setError(null);
    setSuccess(false);

    const result = await registerUserAction(values);

    if (!result.success) {
      setError(result.error ?? 'Unable to create your account.');
      return;
    }

    setSuccess(true);
    reset();
    router.push('/sign-in');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-slate-200">
          Name
        </label>
        <Input id="name" autoComplete="name" placeholder="Your name" {...register('name')} />
        {errors.name ? <p className="text-xs font-medium text-red-400">{errors.name.message}</p> : null}
      </div>
      <div className="space-y-2">
        <label htmlFor="sign-up-email" className="block text-sm font-medium text-slate-200">
          Email
        </label>
        <Input
          id="sign-up-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register('email')}
        />
        {errors.email ? <p className="text-xs font-medium text-red-400">{errors.email.message}</p> : null}
      </div>
      <div className="space-y-2">
        <label htmlFor="sign-up-password" className="block text-sm font-medium text-slate-200">
          Password
        </label>
        <PasswordInput
          id="sign-up-password"
          autoComplete="new-password"
          placeholder="Create a strong password"
          {...register('password')}
        />
        {errors.password ? (
          <p className="text-xs font-medium text-red-400">{errors.password.message}</p>
        ) : null}
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-400">Account created! Redirecting...</p> : null}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Sign up'}
      </Button>
    </form>
  );
}
