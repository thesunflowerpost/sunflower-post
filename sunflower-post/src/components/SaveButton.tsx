'use client';

import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';

interface SaveButtonProps {
  itemType: 'post' | 'book' | 'tv_movie' | 'music' | 'discussion';
  itemId: string;
  initialSaved?: boolean;
  onSaveChange?: (saved: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export default function SaveButton({
  itemType,
  itemId,
  initialSaved = false,
  onSaveChange,
  size = 'md',
  showLabel = false,
  className = '',
}: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsSaved(initialSaved);
  }, [initialSaved]);

  async function handleToggleSave() {
    if (isLoading) return;

    setIsLoading(true);
    const newSavedState = !isSaved;

    // Optimistic update
    setIsSaved(newSavedState);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/saved', {
        method: newSavedState ? 'POST' : 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemType,
          itemId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update save status');
      }

      // Notify parent component
      onSaveChange?.(newSavedState);
    } catch (error) {
      console.error('Failed to toggle save:', error);
      // Revert optimistic update
      setIsSaved(!newSavedState);
    } finally {
      setIsLoading(false);
    }
  }

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  };

  return (
    <button
      onClick={handleToggleSave}
      disabled={isLoading}
      className={`
        rounded-full transition-all hover:scale-110 active:scale-95
        ${isSaved ? 'bg-yellow-400 text-[#3A2E1F]' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}
        ${buttonSizeClasses[size]}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      title={isSaved ? 'Remove from saved' : 'Save for later'}
    >
      <div className="flex items-center gap-1.5">
        <Bookmark
          className={`${sizeClasses[size]} ${isSaved ? 'fill-current' : ''}`}
        />
        {showLabel && (
          <span className="text-xs font-semibold">
            {isSaved ? 'Saved' : 'Save'}
          </span>
        )}
      </div>
    </button>
  );
}
