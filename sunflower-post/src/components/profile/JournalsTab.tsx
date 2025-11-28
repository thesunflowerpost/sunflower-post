"use client";

import { useState } from 'react';
import type { JournalEntry } from '@/types/profile';
import JournalEntryModal from '../JournalEntryModal';

type JournalsTabProps = {
  journals: JournalEntry[];
};

// Format date
function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// Format time
function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function JournalsTab({ journals }: JournalsTabProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  async function handleSaveJournal(entry: {
    title: string;
    body: string;
    mood?: string;
    tags?: string[];
  }) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/journal', {
        method: editingEntry ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editingEntry ? { ...entry, id: editingEntry.id } : entry),
      });

      if (!response.ok) {
        throw new Error('Failed to save journal entry');
      }

      // Refresh the page to show the new entry
      window.location.reload();
    } catch (error) {
      console.error('Failed to save journal entry:', error);
      throw error;
    }
  }

  function handleNewEntry() {
    setEditingEntry(null);
    setShowJournalModal(true);
  }

  function handleEditEntry(entry: JournalEntry) {
    setEditingEntry(entry);
    setShowJournalModal(true);
  }

  if (journals.length === 0) {
    return (
      <>
        <div className="text-center py-12 space-y-3">
          <p className="text-3xl">📔</p>
          <p className="text-[#A08960] text-sm font-medium">
            Your journal is empty.
          </p>
          <p className="text-[#A08960] text-xs max-w-md mx-auto">
            Journal entries are private and only visible to you. Use this space to reflect, process, and track your thoughts.
          </p>
          <button
            onClick={handleNewEntry}
            className="mt-4 px-5 py-2.5 rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-[#3A2E1F] text-sm font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Write your first entry
          </button>
        </div>
        <JournalEntryModal
          isOpen={showJournalModal}
          onClose={() => setShowJournalModal(false)}
          onSave={handleSaveJournal}
          initialEntry={editingEntry || undefined}
        />
      </>
    );
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#7A674C]">
            <span className="font-semibold text-yellow-900">{journals.length}</span> {journals.length === 1 ? 'entry' : 'entries'}
          </p>
          <button
            onClick={handleNewEntry}
            className="px-4 py-2 rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-[#3A2E1F] text-sm font-semibold shadow-md hover:shadow-lg transition-all"
          >
            + New entry
          </button>
        </div>

      <div className="space-y-3">
        {journals.map((entry) => {
          const isExpanded = expandedId === entry.id;
          return (
            <div
              key={entry.id}
              className="bg-gradient-to-br from-white to-yellow-50/20 border border-yellow-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div
                className="cursor-pointer"
                onClick={() => toggleExpand(entry.id)}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-base font-bold text-yellow-900 flex-1">
                    {entry.title}
                  </h3>
                  <button className="text-[#7A674C] hover:text-yellow-900 text-sm">
                    {isExpanded ? '−' : '+'}
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#A08960] mb-2 flex-wrap">
                  <span>{formatDate(entry.createdAt)}</span>
                  <span>·</span>
                  <span>{formatTime(entry.createdAt)}</span>
                  {entry.mood && (
                    <>
                      <span>·</span>
                      <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-medium">
                        {entry.mood}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="pt-3 border-t border-yellow-200/40 mt-3 space-y-3">
                  <p className="text-sm text-[#5C4A33] whitespace-pre-line leading-relaxed">
                    {entry.body}
                  </p>
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 rounded-full bg-yellow-50 text-[#7A674C] border border-yellow-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleEditEntry(entry)}
                      className="text-xs text-yellow-700 hover:text-yellow-900 font-medium hover:underline"
                    >
                      Edit
                    </button>
                    <span className="text-[#C0A987]">·</span>
                    <button className="text-xs text-[#7A674C] hover:text-red-600 font-medium hover:underline">
                      Delete
                    </button>
                  </div>
                </div>
              )}

              {!isExpanded && (
                <p className="text-sm text-[#5C4A33] line-clamp-2 leading-relaxed">
                  {entry.body}
                </p>
              )}
            </div>
          );
        })}
      </div>
      </div>

      <JournalEntryModal
        isOpen={showJournalModal}
        onClose={() => setShowJournalModal(false)}
        onSave={handleSaveJournal}
        initialEntry={editingEntry || undefined}
      />
    </>
  );
}
