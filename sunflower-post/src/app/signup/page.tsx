'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const sunflowerColors = [
  { id: 'classic', color: '#FFD52A', label: 'Classic Yellow' },
  { id: 'honey', color: '#F4A259', label: 'Honey Gold' },
  { id: 'amber', color: '#F59E42', label: 'Amber Glow' },
  { id: 'peach', color: '#FFB4A2', label: 'Peachy Pink' },
  { id: 'sunset', color: '#E07A5F', label: 'Sunset Orange' },
  { id: 'lavender', color: '#C8B6E2', label: 'Soft Lavender' },
];

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedColor, setSelectedColor] = useState('classic');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signup(name, email, password, selectedColor);
      // Redirect to homepage on success
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EFEFF4] shadow-[0_18px_45px_rgba(15,23,42,0.08)] p-6 space-y-6">

        {/* Logo / Heading */}
        <div className="text-center space-y-3">
          <div className="text-5xl">🌻</div>
          <h1 className="text-2xl font-semibold text-[color:var(--deep-soil)]">
            Create your account
          </h1>
          <p className="text-sm text-[color:var(--text-warm-dark)] leading-relaxed">
            Just the basics. No long forms, no personality quizzes. You can always tweak things later.
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
              htmlFor="name"
              className="block text-sm font-medium text-[color:var(--deep-soil)]"
            >
              Name / Display name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#E5E5EA] focus:border-[color:var(--sunflower-gold)] focus:ring-2 focus:ring-[color:var(--sunflower-gold)]/20 outline-none transition-all text-[color:var(--deep-soil)]"
              placeholder="What should we call you?"
            />
          </div>

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
              minLength={8}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E5EA] focus:border-[color:var(--sunflower-gold)] focus:ring-2 focus:ring-[color:var(--sunflower-gold)]/20 outline-none transition-all text-[color:var(--deep-soil)]"
              placeholder="At least 8 characters"
            />
          </div>

          {/* Optional: Pick a sunflower color */}
          <div className="space-y-3 pt-2">
            <label className="block text-sm font-medium text-[color:var(--deep-soil)]">
              Pick a colour for your sunflower <span className="text-[color:var(--text-warm-dark)] font-normal">(optional)</span>
            </label>
            <div className="grid grid-cols-6 gap-2">
              {sunflowerColors.map((colorOption) => (
                <button
                  key={colorOption.id}
                  type="button"
                  onClick={() => setSelectedColor(colorOption.id)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    selectedColor === colorOption.id
                      ? 'border-[color:var(--deep-soil)] scale-110 shadow-md'
                      : 'border-[#E5E5EA] hover:scale-105'
                  }`}
                  style={{ backgroundColor: colorOption.color }}
                  title={colorOption.label}
                  aria-label={colorOption.label}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 rounded-full bg-[#FFD52A] hover:bg-[#ffcc00] text-[color:var(--deep-soil)] font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating your account...' : 'Create account'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-sm text-[color:var(--text-warm-dark)] border-t border-[#EFEFF4] pt-6">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-[color:var(--deep-soil)] font-semibold hover:text-[color:var(--sunflower-gold)] transition-colors"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
