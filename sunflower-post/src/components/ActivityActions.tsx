'use client';

import { useState } from 'react';
import { MoreVertical, ExternalLink, Trash2, Pin, PinOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActivityActionsProps {
  itemId: string;
  itemType: 'post' | 'discussion' | 'reply';
  isPinned?: boolean;
  onView?: () => void;
  onDelete?: () => void;
  onPin?: (pinned: boolean) => void;
  viewUrl?: string;
  showView?: boolean;
  showDelete?: boolean;
  showPin?: boolean;
}

export default function ActivityActions({
  itemId,
  itemType,
  isPinned = false,
  onView,
  onDelete,
  onPin,
  viewUrl,
  showView = true,
  showDelete = true,
  showPin = true,
}: ActivityActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPinning, setIsPinning] = useState(false);

  async function handleDelete() {
    if (!onDelete) return;

    const confirmed = confirm('Are you sure you want to delete this? This action cannot be undone.');
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await onDelete();
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to delete:', error);
    } finally {
      setIsDeleting(false);
    }
  }

  async function handlePin() {
    if (!onPin) return;

    setIsPinning(true);
    try {
      await onPin(!isPinned);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to pin/unpin:', error);
    } finally {
      setIsPinning(false);
    }
  }

  function handleView() {
    if (viewUrl) {
      window.open(viewUrl, '_blank');
    } else if (onView) {
      onView();
    }
    setIsOpen(false);
  }

  return (
    <div className="relative">
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        title="More actions"
      >
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20"
            >
              {/* View Original */}
              {showView && (
                <button
                  onClick={handleView}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-sm text-gray-700"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Original Post
                </button>
              )}

              {/* Pin/Unpin */}
              {showPin && (
                <button
                  onClick={handlePin}
                  disabled={isPinning}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-sm text-gray-700 disabled:opacity-50"
                >
                  {isPinned ? (
                    <>
                      <PinOff className="w-4 h-4" />
                      Unpin from Profile
                    </>
                  ) : (
                    <>
                      <Pin className="w-4 h-4" />
                      Pin to Profile
                    </>
                  )}
                  {isPinning && (
                    <span className="ml-auto text-xs text-gray-500">...</span>
                  )}
                </button>
              )}

              {/* Divider */}
              {(showView || showPin) && showDelete && (
                <div className="my-1 border-t border-gray-200" />
              )}

              {/* Delete */}
              {showDelete && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full px-4 py-2.5 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-sm text-red-600 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                  {isDeleting && (
                    <span className="ml-auto text-xs">Deleting...</span>
                  )}
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
