'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const returnTo = new URLSearchParams(window.location.search).get('redirect') || '/account/dashboard';
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnTo })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No url returned');
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-lg border bg-background p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-center">Login</h1>
        <p className="mb-6 text-sm text-muted-foreground text-center">
          Login to manage your account and orders.
        </p>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-md bg-brand px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Redirecting...' : 'Continue with Shopify'}
        </button>
      </div>
    </div>
  );
}
