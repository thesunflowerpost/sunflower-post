'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      // Redirect to homepage on success
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] px-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EFEFF4] shadow-[0_18px_45px_rgba(15,23,42,0.08)] p-6 space-y-6">

        {/* Logo / Heading */}
        <div className="text-center space-y-3">
          <div className="text-5xl">🌻</div>
          <h1 className="text-2xl font-semibold text-[color:var(--deep-soil)]">
            Welcome back
          </h1>
          <p className="text-sm text-[color:var(--text-warm-dark)] leading-relaxed">
            Log in to your little corner of the internet. Your posts, saves and journals will be right where you left them.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[color:var(--deep-soil)]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#E5E5EA] focus:border-[color:var(--sunflower-gold)] focus:ring-2 focus:ring-[color:var(--sunflower-gold)]/20 outline-none transition-all text-[color:var(--deep-soil)]"
              placeholder="your@email.com"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[color:var(--deep-soil)]"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#E5E5EA] focus:border-[color:var(--sunflower-gold)] focus:ring-2 focus:ring-[color:var(--sunflower-gold)]/20 outline-none transition-all text-[color:var(--deep-soil)]"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#E5E5EA] text-[color:var(--sunflower-gold)] focus:ring-[color:var(--sunflower-gold)]/20"
              />
              <span className="text-[color:var(--text-warm-dark)]">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-[color:var(--text-warm-dark)] hover:text-[color:var(--deep-soil)] transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 rounded-full bg-[#FFD52A] hover:bg-[#ffcc00] text-[color:var(--deep-soil)] font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-sm text-[color:var(--text-warm-dark)] border-t border-[#EFEFF4] pt-6">
          New here?{' '}
          <Link
            href="/signup"
            className="text-[color:var(--deep-soil)] font-semibold hover:text-[color:var(--sunflower-gold)] transition-colors"
          >
            Make a free account
          </Link>
          {' '}— takes 30 seconds.
        </div>
      </div>
    </div>
  );
}
