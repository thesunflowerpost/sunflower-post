"use client";

import { useState } from 'react';
import { Plus, Check } from 'lucide-react';

interface AddToListButtonProps {
  itemType: 'book' | 'tv_movie' | 'music';
  title: string;
  subtitle?: string; // Author for books, Artist for music, Year for movies
  imageUrl?: string;
  defaultStatus?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export default function AddToListButton({
  itemType,
  title,
  subtitle,
  imageUrl,
  defaultStatus,
  size = 'md',
  showLabel = true,
  className = '',
}: AddToListButtonProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get default status based on item type
  const getDefaultStatus = () => {
    if (defaultStatus) return defaultStatus;

    switch (itemType) {
      case 'book':
        return 'To read';
      case 'tv_movie':
        return 'Want to watch';
      case 'music':
        return 'Listening';
      default:
        return 'To read';
    }
  };

  async function handleAddToList() {
    if (isAdded) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user-lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemType,
          title,
          subtitle,
          imageUrl,
          status: getDefaultStatus(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to list');
      }

      setIsAdded(true);

      // Reset after 2 seconds
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to add to list:', error);
      alert('Failed to add to list. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      onClick={handleAddToList}
      disabled={isLoading || isAdded}
      className={`
        ${sizeClasses[size]}
        ${isAdded
          ? 'bg-green-100 border-green-300 text-green-800'
          : 'bg-white border-yellow-200 text-[#7A674C] hover:bg-yellow-50 hover:border-yellow-300'
        }
        ${isLoading ? 'opacity-50 cursor-wait' : ''}
        ${isAdded ? 'cursor-default' : 'cursor-pointer'}
        border-2 rounded-xl font-semibold
        transition-all duration-200
        flex items-center gap-1.5
        ${className}
      `}
      title={isAdded ? 'Added to your list!' : `Add to your ${itemType === 'book' ? 'reading' : itemType === 'tv_movie' ? 'watch' : 'listening'} list`}
    >
      {isAdded ? (
        <Check className={iconSizes[size]} />
      ) : (
        <Plus className={iconSizes[size]} />
      )}
      {showLabel && (
        <span>
          {isAdded ? 'Added!' : 'Add to List'}
        </span>
      )}
    </button>
  );
}
