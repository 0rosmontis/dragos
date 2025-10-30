import Link from 'next/link';

import { SignInForm } from '@/components/auth/sign-in-form';

export const metadata = {
  title: 'Sign in | Dragos'
};

export default function SignInPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 py-16">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold">Welcome back</h1>
        <p className="text-sm text-slate-400">
          Enter your credentials to access your secure messaging dashboard.
        </p>
      </div>
      <SignInForm />
      <p className="text-center text-sm text-slate-400">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="font-medium text-brand hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
