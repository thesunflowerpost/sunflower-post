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
    <nav className="flex items-center gap-1.5 text-[10px] text-[#7A674C]">
      <a
        href="/"
        className="px-2.5 py-1.5 rounded-full bg-yellow-50 text-yellow-900 font-medium shadow-sm"
      >
        Home
      </a>
      <a
        href="/lounge"
        className="px-2.5 py-1.5 rounded-full hover:bg-yellow-50 hover:text-yellow-900 transition"
      >
        Community
      </a>
      <a
        href="/journal"
        className="px-2.5 py-1.5 rounded-full hover:bg-yellow-50 hover:text-yellow-900 transition hidden md:inline-flex"
      >
        Journal
      </a>

      {user ? (
        <>
          <div className="w-px h-4 bg-yellow-200 mx-1 hidden md:block" />
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-8 h-8 rounded-full bg-yellow-400 hover:bg-yellow-500 flex items-center justify-center shadow-sm transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
              aria-label="User menu"
            >
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-[#3A2E1F]">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-yellow-100 py-1 z-[100]">
                <div className="px-4 py-2 border-b border-yellow-100">
                  <p className="text-xs font-semibold text-[#3A2E1F] truncate">
                    {user.name}
                  </p>
                  <p className="text-[9px] text-[#7A674C] truncate">{user.email}</p>
                </div>
                <a
                  href="/profile"
                  className="block px-4 py-2 text-[10px] text-[#7A674C] hover:bg-yellow-50 transition"
                >
                  My Profile
                </a>
                <a
                  href="/settings"
                  className="block px-4 py-2 text-[10px] text-[#7A674C] hover:bg-yellow-50 transition"
                >
                  Settings
                </a>
                <a
                  href="/my-posts"
                  className="block px-4 py-2 text-[10px] text-[#7A674C] hover:bg-yellow-50 transition"
                >
                  My Posts
                </a>
                <a
                  href="/personal-journals"
                  className="block px-4 py-2 text-[10px] text-[#7A674C] hover:bg-yellow-50 transition"
                >
                  My Journals
                </a>
                <div className="border-t border-yellow-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-[10px] text-red-600 hover:bg-red-50 transition"
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
          <div className="w-px h-4 bg-yellow-200 mx-1 hidden md:block" />
          <Link
            href="/login"
            className="px-2.5 py-1.5 rounded-full hover:bg-yellow-50 hover:text-yellow-900 transition font-medium"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-2.5 py-1.5 rounded-full bg-yellow-400 hover:bg-yellow-500 text-[#3A2E1F] font-semibold shadow-sm transition-all hover:shadow-md"
          >
            Sign up
          </Link>
        </>
      )}
    </nav>
  );
}
