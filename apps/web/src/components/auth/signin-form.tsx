'use client';

import { useState } from 'react';
import { signIn, getProviders } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@theglobalconnect/ui';

export function SignInForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Input
          name="email"
          type="email"
          placeholder="Email address"
          required
          error={error}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm text-center">{error}</div>
      )}

      <Button
        type="submit"
        loading={loading}
        className="w-full"
      >
        Sign in
      </Button>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => signIn('google')}
            className="w-full"
          >
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => signIn('github')}
            className="w-full"
          >
            GitHub
          </Button>
        </div>
      </div>
    </form>
  );
}