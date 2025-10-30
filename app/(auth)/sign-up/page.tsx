import Link from 'next/link';

import { SignUpForm } from '@/components/auth/sign-up-form';

export const metadata = {
  title: 'Sign up | Dragos'
};

export default function SignUpPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 py-16">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold">Create your account</h1>
        <p className="text-sm text-slate-400">
          Join Dragos to send and receive secure messages with ease.
        </p>
      </div>
      <SignUpForm />
      <p className="text-center text-sm text-slate-400">
        Already registered?{' '}
        <Link href="/sign-in" className="font-medium text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
