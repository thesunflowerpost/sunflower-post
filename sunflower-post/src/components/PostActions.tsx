"use client";

import { useState } from "react";

type PostActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
};

export default function PostActions({ onEdit, onDelete, className = "" }: PostActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function handleDelete() {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    onDelete();
    setShowDeleteConfirm(false);
  }

  function handleCancel() {
    setShowDeleteConfirm(false);
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {!showDeleteConfirm ? (
        <>
          <button
            onClick={onEdit}
            className="text-[10px] text-[#7A674C] hover:text-yellow-900 hover:underline transition-colors"
            aria-label="Edit"
          >
            Edit
          </button>
          <span className="text-[#C0A987]">·</span>
          <button
            onClick={handleDelete}
            className="text-[10px] text-[#7A674C] hover:text-red-600 hover:underline transition-colors"
            aria-label="Delete"
          >
            Delete
          </button>
        </>
      ) : (
        <>
          <span className="text-[10px] text-red-600 font-medium">Delete this?</span>
          <button
            onClick={handleDelete}
            className="text-[10px] text-red-600 hover:text-red-800 font-semibold hover:underline transition-colors"
          >
            Yes
          </button>
          <span className="text-[#C0A987]">·</span>
          <button
            onClick={handleCancel}
            className="text-[10px] text-[#7A674C] hover:text-yellow-900 hover:underline transition-colors"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
}
