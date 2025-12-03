'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import JournalEntryModal from '@/components/JournalEntryModal';
import { Calendar, Tag, Smile, Search, Plus, Sparkles } from 'lucide-react';

interface JournalEntry {
  id: string;
  title: string;
  body: string;
  mood?: string;
  tags?: string[];
  ai_insights?: any[];
  created_at: string;
  updated_at: string;
}

// Mood emoji mapping
const MOOD_EMOJIS: Record<string, string> = {
  'Happy': '😊',
  'Peaceful': '😌',
  'Thoughtful': '🤔',
  'Excited': '🤩',
  'Grateful': '🙏',
  'Anxious': '😰',
  'Sad': '😢',
  'Calm': '🧘',
  'Energized': '⚡',
  'Hopeful': '🌈',
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

export default function JournalsPage() {
  const router = useRouter();
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [filteredJournals, setFilteredJournals] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadJournals();
  }, []);

  useEffect(() => {
    // Filter journals
    let filtered = journals;

    // Filter by mood
    if (selectedMood !== 'All') {
      filtered = filtered.filter(j => j.mood === selectedMood);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        j =>
          j.title.toLowerCase().includes(query) ||
          j.body.toLowerCase().includes(query) ||
          j.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredJournals(filtered);
  }, [journals, selectedMood, searchQuery]);

  async function loadJournals() {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/journal', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setJournals(data.entries || []);
      }
    } catch (error) {
      console.error('Failed to load journals:', error);
    } finally {
      setIsLoading(false);
    }
  }

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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          editingEntry ? { ...entry, id: editingEntry.id } : entry
        ),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Save error:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(errorData.error || `Failed to save: ${response.status} ${response.statusText}`);
      }

      // Reload journals
      await loadJournals();
      setShowJournalModal(false);
      setEditingEntry(null);
    } catch (error) {
      console.error('Failed to save journal entry:', error);
      throw error;
    }
  }

  async function handleDeleteEntry(id: string) {
    if (!confirm('Are you sure you want to delete this journal entry?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/journal', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete journal entry');
      }

      await loadJournals();
    } catch (error) {
      console.error('Failed to delete journal entry:', error);
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

  // Get unique moods from journals
  const uniqueMoods = ['All', ...Array.from(new Set(journals.map(j => j.mood).filter(Boolean)))];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">My Journal</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Private reflections
              </p>
            </div>
            <button
              onClick={handleNewEntry}
              className="px-4 py-2 rounded-md bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Entry
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search entries..."
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:border-gray-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Mood filter */}
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:border-gray-400 focus:outline-none transition-colors"
            >
              {uniqueMoods.map((mood) => (
                <option key={mood} value={mood}>
                  {mood === 'All' ? 'All Moods' : `${MOOD_EMOJIS[mood] || ''} ${mood}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Journal Entries */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredJournals.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <p className="text-gray-600 text-base">
              {searchQuery || selectedMood !== 'All'
                ? 'No entries found'
                : 'No entries yet'}
            </p>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              {searchQuery || selectedMood !== 'All'
                ? 'Try adjusting your search or filters'
                : 'Start writing to capture your thoughts and reflections.'}
            </p>
            {!searchQuery && selectedMood === 'All' && (
              <button
                onClick={handleNewEntry}
                className="mt-4 px-4 py-2 rounded-md bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium transition-colors"
              >
                Write your first entry
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJournals.map((entry) => {
              const isExpanded = expandedId === entry.id;
              const preview = entry.body.slice(0, 200);
              const needsExpansion = entry.body.length > 200;

              return (
                <article
                  key={entry.id}
                  className="bg-white border-b border-gray-200 py-6 last:border-b-0"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">
                        {entry.title}
                      </h2>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{formatDate(entry.created_at)}</span>
                        {entry.mood && (
                          <>
                            <span className="text-gray-300">·</span>
                            <span>{MOOD_EMOJIS[entry.mood]} {entry.mood}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditEntry(entry)}
                        className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="px-2 py-1 text-xs font-medium text-gray-400 hover:text-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="prose prose-sm max-w-none mb-3">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base">
                      {isExpanded ? entry.body : preview}
                      {needsExpansion && !isExpanded && '...'}
                    </p>
                    {needsExpansion && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                        className="text-xs text-gray-500 hover:text-gray-900 font-medium mt-2"
                      >
                        {isExpanded ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>

                  {/* AI Insights */}
                  {entry.ai_insights && entry.ai_insights.length > 0 && (
                    <div className="mb-3 space-y-2">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-gray-400" />
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          AI Notes
                        </p>
                      </div>
                      {entry.ai_insights.map((insight: any, idx: number) => {
                        const modeLabels: Record<string, string> = {
                          'understand-feelings': '🌈 Emotion Understanding',
                          'emotion-wheel': '🎨 Emotion Wheel',
                          'make-sense': '🧩 Thought Summary',
                          'uplift': '✨ Uplifting Reflection',
                          'compassion-rewrite': '💛 Compassion Rewrite',
                          'deeper-questions': '💭 Reflection Questions',
                        };

                        return (
                          <div
                            key={idx}
                            className="p-2.5 bg-gray-50 rounded-md border border-gray-200"
                          >
                            <p className="text-xs font-medium text-gray-700 mb-1">
                              {modeLabels[insight.mode] || insight.mode}
                            </p>
                            <div className="text-xs text-gray-600">
                              {insight.mode === 'understand-feelings' && insight.data.primaryEmotion && (
                                <p>Primary emotion: <span className="font-medium">{insight.data.primaryEmotion}</span></p>
                              )}
                              {insight.mode === 'make-sense' && insight.data.summary && (
                                <p className="italic">&quot;{insight.data.summary}&quot;</p>
                              )}
                              {insight.mode === 'uplift' && insight.data.reflection && (
                                <p className="italic">&quot;{insight.data.reflection}&quot;</p>
                              )}
                              {insight.mode === 'compassion-rewrite' && insight.data.rewrittenEntry && (
                                <p className="italic">&quot;{insight.data.rewrittenEntry.slice(0, 100)}...&quot;</p>
                              )}
                              {insight.mode === 'deeper-questions' && insight.data.questions && (
                                <p>Asked {insight.data.questions.length} reflection question(s)</p>
                              )}
                              {insight.mode === 'emotion-wheel' && insight.data.emotions && (
                                <p>Explored {insight.data.emotions.length} emotions</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Tags */}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {entry.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* Stats */}
        {journals.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500">
            Showing {filteredJournals.length} of {journals.length} entries
          </div>
        )}
      </div>

      {/* Journal Entry Modal */}
      <JournalEntryModal
        isOpen={showJournalModal}
        onClose={() => {
          setShowJournalModal(false);
          setEditingEntry(null);
        }}
        onSave={handleSaveJournal}
        initialEntry={editingEntry || undefined}
      />
    </div>
  );
}
