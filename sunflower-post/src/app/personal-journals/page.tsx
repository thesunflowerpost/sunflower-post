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
        const errorData = await response.json();
        console.error('Save error:', errorData);
        throw new Error(errorData.error || 'Failed to save journal entry');
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-yellow-200/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#3A2E1F] flex items-center gap-2">
                <span>📔</span>
                <span>My Journal</span>
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Your private space for reflection and growth
              </p>
            </div>
            <button
              onClick={handleNewEntry}
              className="px-5 py-2.5 rounded-full bg-yellow-400 hover:bg-yellow-500 text-[#3A2E1F] text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Entry
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-6 border-2 border-yellow-200/60">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search journals..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Mood filter */}
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none transition-colors"
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
          </div>
        ) : filteredJournals.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <p className="text-3xl">📔</p>
            <p className="text-gray-600 font-medium">
              {searchQuery || selectedMood !== 'All'
                ? 'No journal entries match your filters'
                : 'Your journal is empty'}
            </p>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              {searchQuery || selectedMood !== 'All'
                ? 'Try adjusting your search or filters'
                : 'Journal entries are private and only visible to you. Use this space to reflect, process, and track your thoughts.'}
            </p>
            {!searchQuery && selectedMood === 'All' && (
              <button
                onClick={handleNewEntry}
                className="mt-4 px-5 py-2.5 rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-[#3A2E1F] text-sm font-semibold shadow-md hover:shadow-lg transition-all"
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
                  className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100 hover:border-yellow-200 hover:shadow-lg transition-all"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-[#3A2E1F] mb-2">
                        {entry.title}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(entry.created_at)}</span>
                          <span className="text-gray-400">at</span>
                          <span>{formatTime(entry.created_at)}</span>
                        </div>
                        {entry.mood && (
                          <div className="flex items-center gap-1">
                            <Smile className="w-4 h-4" />
                            <span>
                              {MOOD_EMOJIS[entry.mood]} {entry.mood}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditEntry(entry)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="prose prose-sm max-w-none mb-4">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {isExpanded ? entry.body : preview}
                      {needsExpansion && !isExpanded && '...'}
                    </p>
                    {needsExpansion && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                        className="text-sm text-yellow-700 hover:text-yellow-900 font-medium mt-2"
                      >
                        {isExpanded ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>

                  {/* AI Insights */}
                  {entry.ai_insights && entry.ai_insights.length > 0 && (
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <p className="text-xs font-semibold text-purple-900 uppercase tracking-wide">
                          AI Companion Notes
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
                            className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200"
                          >
                            <p className="text-xs font-semibold text-purple-800 mb-1">
                              {modeLabels[insight.mode] || insight.mode}
                            </p>
                            <div className="text-xs text-gray-700">
                              {insight.mode === 'understand-feelings' && insight.data.primaryEmotion && (
                                <p>Primary emotion: <span className="font-semibold">{insight.data.primaryEmotion}</span></p>
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="w-4 h-4 text-gray-400" />
                      {entry.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-yellow-50 text-yellow-800 rounded-full text-xs font-medium"
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
