'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Sparkles, Heart, Brain, FileText } from 'lucide-react';
import JournalAIAssistant from './JournalAIAssistant';

interface JournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: {
    title: string;
    body: string;
    mood?: string;
    tags?: string[];
    ai_insights?: any[];
  }) => Promise<void>;
  initialEntry?: {
    id?: string;
    title: string;
    body: string;
    mood?: string;
    tags?: string[];
  };
}

const MOODS = [
  '😊 Happy',
  '😌 Peaceful',
  '🤔 Thoughtful',
  '😔 Sad',
  '😰 Anxious',
  '😤 Frustrated',
  '🥳 Excited',
  '😴 Tired',
  '💪 Motivated',
  '🌈 Hopeful',
];

const TEMPLATES = [
  {
    id: 'gratitude',
    name: 'Gratitude',
    icon: Heart,
    title: 'Things I\'m grateful for today',
    body: 'Today I\'m grateful for:\n\n1. \n2. \n3. \n\nThese things made me feel...',
  },
  {
    id: 'reflection',
    icon: Brain,
    name: 'Reflection',
    title: 'Daily reflection',
    body: 'What went well today:\n\n\nWhat I learned:\n\n\nWhat I want to improve:\n\n',
  },
  {
    id: 'processing',
    icon: FileText,
    name: 'Processing',
    title: 'Processing my feelings',
    body: 'What happened:\n\n\nHow I felt:\n\n\nWhat I need:\n\n',
  },
];

const AUTOSAVE_DELAY = 2000; // 2 seconds

export default function JournalEntryModal({
  isOpen,
  onClose,
  onSave,
  initialEntry,
}: JournalEntryModalProps) {
  const [title, setTitle] = useState(initialEntry?.title || '');
  const [body, setBody] = useState(initialEntry?.body || '');
  const [mood, setMood] = useState(initialEntry?.mood || '');
  const [tags, setTags] = useState<string[]>(initialEntry?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiInsights, setAiInsights] = useState<any[]>([]);

  // Auto-save to localStorage
  const saveDraft = useCallback(() => {
    if (title || body) {
      setAutoSaveStatus('saving');
      localStorage.setItem(
        'journal_draft',
        JSON.stringify({
          title,
          body,
          mood,
          tags,
          timestamp: Date.now(),
        })
      );
      setTimeout(() => {
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus('idle'), 2000);
      }, 500);
    }
  }, [title, body, mood, tags]);

  // Auto-save effect
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      saveDraft();
    }, AUTOSAVE_DELAY);

    return () => clearTimeout(timer);
  }, [title, body, mood, tags, isOpen, saveDraft]);

  // Load draft on open
  useEffect(() => {
    if (isOpen && !initialEntry) {
      const draft = localStorage.getItem('journal_draft');
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          // Only load draft if it's less than 24 hours old
          if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
            setTitle(parsed.title || '');
            setBody(parsed.body || '');
            setMood(parsed.mood || '');
            setTags(parsed.tags || []);
          }
        } catch (e) {
          console.error('Failed to load draft:', e);
        }
      }
      setShowTemplates(!title && !body);
    }
  }, [isOpen, initialEntry]);

  // Track unsaved changes
  useEffect(() => {
    const hasChanges =
      title !== (initialEntry?.title || '') ||
      body !== (initialEntry?.body || '') ||
      mood !== (initialEntry?.mood || '') ||
      JSON.stringify(tags) !== JSON.stringify(initialEntry?.tags || []);
    setHasUnsavedChanges(hasChanges);
  }, [title, body, mood, tags, initialEntry]);

  function handleAddTag() {
    const tag = tagInput.trim().toLowerCase().replace(/^#/, '');
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  }

  function handleRemoveTag(tagToRemove: string) {
    setTags(tags.filter((t) => t !== tagToRemove));
  }

  function handleTagInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  }

  function applyTemplate(template: typeof TEMPLATES[0]) {
    setTitle(template.title);
    setBody(template.body);
    setShowTemplates(false);
  }

  async function handleSave() {
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!body.trim()) {
      setError('Please write something');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave({
        title: title.trim(),
        body: body.trim(),
        mood: mood || undefined,
        tags: tags.length > 0 ? tags : undefined,
        ai_insights: aiInsights.length > 0 ? aiInsights : undefined,
      });

      // Clear draft after successful save
      localStorage.removeItem('journal_draft');

      // Reset form
      setTitle('');
      setBody('');
      setMood('');
      setTags([]);
      setTagInput('');

      onClose();
    } catch (err) {
      setError('Failed to save journal entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  function handleClose() {
    if (hasUnsavedChanges) {
      const confirmed = confirm('You have unsaved changes. Do you want to close anyway?');
      if (!confirmed) return;
    }
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-3xl z-10">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-[#3A2E1F]">
                    {initialEntry ? 'Edit Entry' : 'New Journal Entry'}
                  </h2>
                  {autoSaveStatus !== 'idle' && (
                    <span className="text-xs text-gray-500">
                      {autoSaveStatus === 'saving' ? 'Saving draft...' : '✓ Draft saved'}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  disabled={isSaving}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                  </div>
                )}

                {/* Templates */}
                {showTemplates && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-700">
                        Start with a template:
                      </p>
                      <button
                        onClick={() => setShowTemplates(false)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Skip
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {TEMPLATES.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => applyTemplate(template)}
                          className="p-4 rounded-xl border-2 border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 transition-all text-center"
                        >
                          <template.icon className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                          <div className="text-sm font-semibold text-[#3A2E1F]">
                            {template.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Title */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#3A2E1F]">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your entry a title..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none transition-colors text-lg font-medium"
                    disabled={isSaving}
                    maxLength={100}
                  />
                </div>

                {/* Mood Selector */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#3A2E1F]">
                    How are you feeling?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {MOODS.map((moodOption) => (
                      <button
                        key={moodOption}
                        onClick={() => setMood(mood === moodOption ? '' : moodOption)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                          mood === moodOption
                            ? 'bg-yellow-400 text-[#3A2E1F] shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {moodOption}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Body */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#3A2E1F]">
                    Your thoughts <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write freely... this is your private space."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none transition-colors resize-none"
                    rows={12}
                    disabled={isSaving}
                  />
                </div>

                {/* AI Assistant Toggle */}
                {body.trim().length > 50 && !showAIAssistant && (
                  <div className="border-2 border-yellow-200/60 rounded-2xl p-4 bg-gradient-to-br from-yellow-50/50 to-white">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#3A2E1F] mb-1 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-yellow-600" />
                          Want some gentle support?
                        </p>
                        <p className="text-xs text-[#7A674C]">
                          Get optional AI assistance to explore your feelings, make sense of your thoughts, or find encouragement.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowAIAssistant(true)}
                        className="ml-4 px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-[#3A2E1F] text-sm font-semibold shadow-sm hover:shadow-md transition-all whitespace-nowrap"
                      >
                        Try AI Support
                      </button>
                    </div>
                  </div>
                )}

                {/* AI Assistant Component */}
                {showAIAssistant && body.trim().length > 50 && (
                  <JournalAIAssistant
                    journalEntry={body}
                    onClose={() => setShowAIAssistant(false)}
                    onResponseReceived={(response) => {
                      // Save AI response to insights array
                      setAiInsights(prev => [...prev, {
                        mode: response.mode,
                        timestamp: new Date().toISOString(),
                        data: response.data,
                        hasCrisisLanguage: response.hasCrisisLanguage,
                      }]);
                    }}
                  />
                )}

                {/* Tags */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#3A2E1F]">
                    Tags (optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                      placeholder="Add a tag..."
                      className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none transition-colors"
                      disabled={isSaving}
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all"
                      disabled={isSaving}
                    >
                      Add
                    </button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm"
                        >
                          #{tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-yellow-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-3xl">
                <p className="text-xs text-gray-500">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  Journal entries are private and only visible to you
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold transition-all"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-[#3A2E1F] font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSaving || !title.trim() || !body.trim()}
                  >
                    <Save className="w-5 h-5 inline mr-2" />
                    {isSaving ? 'Saving...' : 'Save Entry'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
