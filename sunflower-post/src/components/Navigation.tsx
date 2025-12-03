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
                className="absolute right-0 mt-2 w-52 rounded-lg py-1 z-[9999]"
                style={{
                  background: 'white',
                  boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                  border: '1px solid #e5e7eb'
                }}
              >
                <div className="px-4 py-3" style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <p className="text-sm font-semibold truncate text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-xs truncate text-gray-500">{user.email}</p>
                </div>
                <a
                  href="/profile"
                  className="block px-4 py-2 text-sm hover:bg-gray-50 transition text-gray-700"
                >
                  My Profile
                </a>
                <a
                  href="/settings"
                  className="block px-4 py-2 text-sm hover:bg-gray-50 transition text-gray-700"
                >
                  Settings
                </a>
                <a
                  href="/my-posts"
                  className="block px-4 py-2 text-sm hover:bg-gray-50 transition text-gray-700"
                >
                  My Posts
                </a>
                <a
                  href="/personal-journals"
                  className="block px-4 py-2 text-sm hover:bg-gray-50 transition text-gray-700"
                >
                  My Journals
                </a>
                <div style={{ borderTop: '1px solid #e5e7eb' }} className="mt-1 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm transition hover:bg-red-50 text-red-600"
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
