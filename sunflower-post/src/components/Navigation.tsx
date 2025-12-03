'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
      <a
        href="/"
        className="px-3 py-1.5 rounded-lg font-medium transition-colors"
        style={{
          background: 'var(--sunflower-gold)',
          color: 'var(--deep-soil)'
        }}
      >
        Home
      </a>
      <a
        href="/lounge"
        className="px-3 py-1.5 rounded-lg hover:bg-[var(--sage-green)] transition-colors font-medium"
      >
        Community
      </a>
      <a
        href="/journal"
        className="px-3 py-1.5 rounded-lg hover:bg-[var(--sage-green)] transition-colors font-medium hidden md:inline-flex"
      >
        Journal
      </a>

      {user ? (
        <>
          <div className="w-px h-5 mx-2 hidden md:block" style={{ background: 'var(--border-soft)' }} />
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:shadow-md focus:outline-none"
              style={{
                background: 'var(--sunflower-gold)',
                boxShadow: 'var(--shadow-soft)'
              }}
              aria-label="User menu"
            >
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold" style={{ color: 'var(--deep-soil)' }}>
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </button>

            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-52 rounded-lg py-1 z-[100]"
                style={{
                  background: 'var(--soft-cream)',
                  boxShadow: 'var(--shadow-large)',
                  border: '1px solid var(--border-soft)'
                }}
              >
                <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {user.name}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>{user.email}</p>
                </div>
                <a
                  href="/profile"
                  className="block px-4 py-2 text-sm hover:bg-[var(--sage-green)] transition"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  My Profile
                </a>
                <a
                  href="/settings"
                  className="block px-4 py-2 text-sm hover:bg-[var(--sage-green)] transition"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Settings
                </a>
                <a
                  href="/my-posts"
                  className="block px-4 py-2 text-sm hover:bg-[var(--sage-green)] transition"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  My Posts
                </a>
                <a
                  href="/personal-journals"
                  className="block px-4 py-2 text-sm hover:bg-[var(--sage-green)] transition"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  My Journals
                </a>
                <div style={{ borderTop: '1px solid var(--border-soft)' }} className="mt-1 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm transition"
                    style={{ color: 'var(--error)' }}
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="w-px h-5 mx-2 hidden md:block" style={{ background: 'var(--border-soft)' }} />
          <Link
            href="/login"
            className="px-3 py-1.5 rounded-lg hover:bg-[var(--sage-green)] transition font-medium text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-4 py-1.5 rounded-lg font-semibold text-sm transition-all btn-primary"
          >
            Sign up
          </Link>
        </>
      )}
    </nav>
  );
}
