"use client";

import { useState } from 'react';
import type {
  AIJournalMode,
  AIJournalResponse,
  EmotionIdentification,
  EmotionSuggestion,
  ThoughtSummary,
  UpliftingReflection,
  CompassionRewrite,
  DeeperQuestions,
} from '@/types/journalAI';

interface JournalAIAssistantProps {
  journalEntry: string;
  onClose?: () => void;
}

export default function JournalAIAssistant({ journalEntry, onClose }: JournalAIAssistantProps) {
  const [selectedMode, setSelectedMode] = useState<AIJournalMode | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIJournalResponse | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionSuggestion | null>(null);

  const modes = [
    {
      id: 'understand-feelings' as AIJournalMode,
      icon: '🌈',
      label: 'Help me understand',
      description: 'Identify emotions you might be feeling',
    },
    {
      id: 'make-sense' as AIJournalMode,
      icon: '🧩',
      label: 'Make sense of this',
      description: 'Summarize thoughts and themes',
    },
    {
      id: 'uplift' as AIJournalMode,
      icon: '✨',
      label: 'Gently uplift me',
      description: 'Warm, encouraging reflection',
    },
    {
      id: 'compassion-rewrite' as AIJournalMode,
      icon: '💛',
      label: 'Compassion rewrite',
      description: 'Soften harsh self-judgment',
    },
    {
      id: 'deeper-questions' as AIJournalMode,
      icon: '💭',
      label: 'Ask deeper questions',
      description: 'Prompts for reflection',
    },
  ];

  async function handleModeSelect(mode: AIJournalMode) {
    setSelectedMode(mode);
    setLoading(true);
    setResponse(null);
    setSelectedEmotion(null);

    try {
      const res = await fetch('/api/journal-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entry: journalEntry,
          mode,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const data: AIJournalResponse = await res.json();
      setResponse(data);
    } catch (error) {
      console.error('AI assistant error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      alert(`Sorry, ${errorMessage}. Please make sure your dev server is running and API key is configured.`);
    } finally {
      setLoading(false);
    }
  }

  function renderResponse() {
    if (!response) return null;

    return (
      <div className="space-y-4">
        {/* Safety Prompt if needed */}
        {response.hasCrisisLanguage && response.safetyPrompt && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🆘</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-900 mb-1">
                  Important
                </p>
                <p className="text-xs text-red-800 leading-relaxed">
                  {response.safetyPrompt}
                </p>
                <p className="text-xs text-red-700 mt-2">
                  Crisis resources: <a href="tel:988" className="underline font-semibold">988 Suicide & Crisis Lifeline</a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mode-specific rendering */}
        {response.mode === 'understand-feelings' && renderEmotionIdentification(response.data as EmotionIdentification)}
        {response.mode === 'emotion-wheel' && renderEmotionWheel(response.data as EmotionSuggestion[])}
        {response.mode === 'make-sense' && renderThoughtSummary(response.data as ThoughtSummary)}
        {response.mode === 'uplift' && renderUpliftingReflection(response.data as UpliftingReflection)}
        {response.mode === 'compassion-rewrite' && renderCompassionRewrite(response.data as CompassionRewrite)}
        {response.mode === 'deeper-questions' && renderDeeperQuestions(response.data as DeeperQuestions)}
      </div>
    );
  }

  function renderEmotionIdentification(data: EmotionIdentification) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 border border-purple-200">
        <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
          <span>🌈</span>
          <span>What I'm noticing</span>
        </h3>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">
              Primary Emotion
            </p>
            <p className="text-2xl font-bold text-purple-900">
              {data.primaryEmotion}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">
              Secondary Emotion
            </p>
            <p className="text-xl font-bold text-purple-800">
              {data.secondaryEmotion}
            </p>
          </div>

          {data.supportingPatterns && data.supportingPatterns.length > 0 && (
            <div className="pt-4 border-t border-purple-200">
              <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-3">
                I'm also noticing
              </p>
              <ul className="space-y-2">
                {data.supportingPatterns.map((pattern, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">•</span>
                    <span className="text-sm text-purple-900 leading-relaxed">{pattern}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderEmotionWheel(emotions: EmotionSuggestion[]) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#3A2E1F] flex items-center gap-2">
          <span>🎨</span>
          <span>You might be feeling...</span>
        </h3>

        <div className="grid md:grid-cols-2 gap-3">
          {emotions.map((emotion, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedEmotion(selectedEmotion?.emotion === emotion.emotion ? null : emotion)}
              className={`text-left p-4 rounded-2xl border-2 transition-all ${
                selectedEmotion?.emotion === emotion.emotion
                  ? 'bg-yellow-100 border-yellow-400 shadow-md'
                  : 'bg-white border-yellow-200 hover:border-yellow-300 hover:shadow-sm'
              }`}
            >
              <p className="font-bold text-[#3A2E1F] mb-1">{emotion.emotion}</p>
              <p className="text-xs text-[#7A674C] leading-relaxed">{emotion.explanation}</p>

              {selectedEmotion?.emotion === emotion.emotion && (
                <div className="mt-3 pt-3 border-t border-yellow-300">
                  <p className="text-xs font-semibold text-[#7A674C] mb-2">Reflect on:</p>
                  <ul className="space-y-1">
                    {emotion.reflectionQuestions.map((q, qIdx) => (
                      <li key={qIdx} className="text-xs text-[#5C4A33] leading-relaxed">
                        • {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  function renderThoughtSummary(data: ThoughtSummary) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-6 border border-blue-200 space-y-4">
        <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
          <span>🧩</span>
          <span>Making sense of it</span>
        </h3>

        <div>
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
            Summary
          </p>
          <p className="text-sm text-blue-900 leading-relaxed">{data.summary}</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
            Main Theme
          </p>
          <p className="text-sm text-blue-900 leading-relaxed">{data.mainTheme}</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
            The Core Tension
          </p>
          <p className="text-sm text-blue-900 leading-relaxed">{data.coreTension}</p>
        </div>

        {data.withinControl && data.withinControl.length > 0 && (
          <div className="pt-4 border-t border-blue-200">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-3">
              What's Within Your Control
            </p>
            <ul className="space-y-2">
              {data.withinControl.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  <span className="text-sm text-blue-900 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  function renderUpliftingReflection(data: UpliftingReflection) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-3xl p-6 border border-yellow-300 space-y-4">
        <h3 className="text-lg font-bold text-yellow-900 flex items-center gap-2">
          <span>✨</span>
          <span>A gentle reflection</span>
        </h3>

        <p className="text-sm text-yellow-900 leading-relaxed italic">
          "{data.reflection}"
        </p>

        <div className="pt-4 border-t border-yellow-200">
          <p className="text-xs font-semibold text-yellow-800 mb-2">Remember:</p>
          <p className="text-sm text-yellow-900 leading-relaxed">{data.gentleReminder}</p>
        </div>
      </div>
    );
  }

  function renderCompassionRewrite(data: CompassionRewrite) {
    return (
      <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-6 border border-pink-200 space-y-4">
        <h3 className="text-lg font-bold text-pink-900 flex items-center gap-2">
          <span>💛</span>
          <span>With more compassion</span>
        </h3>

        <div>
          <p className="text-xs font-semibold text-pink-700 uppercase tracking-wide mb-2">
            Your entry, rewritten
          </p>
          <div className="bg-white/60 rounded-2xl p-4 border border-pink-200">
            <p className="text-sm text-pink-900 leading-relaxed whitespace-pre-wrap">
              {data.rewrittenEntry}
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-pink-700 uppercase tracking-wide mb-2">
            What shifted
          </p>
          <p className="text-sm text-pink-900 leading-relaxed">{data.whatChanged}</p>
        </div>
      </div>
    );
  }

  function renderDeeperQuestions(data: DeeperQuestions) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-200 space-y-4">
        <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
          <span>💭</span>
          <span>Questions to sit with</span>
        </h3>

        <ul className="space-y-3">
          {data.questions.map((question, idx) => (
            <li key={idx} className="flex items-start gap-3 p-3 bg-white/60 rounded-xl border border-indigo-100">
              <span className="text-indigo-400 font-bold text-sm flex-shrink-0">{idx + 1}.</span>
              <p className="text-sm text-indigo-900 leading-relaxed">{question}</p>
            </li>
          ))}
        </ul>

        <div className="pt-4 border-t border-indigo-200">
          <p className="text-xs text-indigo-700 italic leading-relaxed">
            {data.invitationNote}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-yellow-50/30 rounded-3xl border-2 border-yellow-200/60 p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#3A2E1F] mb-1">
            AI Journaling Companion
          </h2>
          <p className="text-sm text-[#7A674C]">
            Optional gentle support for your reflection
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-[#A08960] hover:text-[#3A2E1F] transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Mode Selection */}
      {!selectedMode && (
        <div className="space-y-3">
          <p className="text-xs text-[#7A674C] mb-3">
            Choose how you'd like support with this entry:
          </p>
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleModeSelect(mode.id)}
              className="w-full text-left p-4 rounded-2xl border-2 border-yellow-200 bg-white hover:border-yellow-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{mode.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-[#3A2E1F] group-hover:text-yellow-700 transition-colors">
                    {mode.label}
                  </p>
                  <p className="text-xs text-[#7A674C]">{mode.description}</p>
                </div>
                <span className="text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-4xl mb-4">🌻</div>
          <p className="text-sm text-[#7A674C]">Reflecting on your words...</p>
        </div>
      )}

      {/* Response */}
      {!loading && response && (
        <div className="space-y-4">
          {renderResponse()}

          {/* Back Button */}
          <button
            onClick={() => {
              setSelectedMode(null);
              setResponse(null);
              setSelectedEmotion(null);
            }}
            className="w-full px-4 py-2 rounded-xl border border-yellow-200 bg-white hover:bg-yellow-50 text-sm font-medium text-[#7A674C] hover:text-[#3A2E1F] transition-all"
          >
            ← Try another mode
          </button>
        </div>
      )}
    </div>
  );
}
