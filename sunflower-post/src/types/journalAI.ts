/**
 * Types for AI-powered Journal Assistant
 */

export type AIJournalMode =
  | 'understand-feelings'
  | 'emotion-wheel'
  | 'make-sense'
  | 'uplift'
  | 'compassion-rewrite'
  | 'deeper-questions';

export interface EmotionIdentification {
  primaryEmotion: string;
  secondaryEmotion: string;
  supportingPatterns: string[];
}

export interface EmotionSuggestion {
  emotion: string;
  explanation: string;
  reflectionQuestions: string[];
}

export interface ThoughtSummary {
  summary: string;
  mainTheme: string;
  coreTension: string;
  withinControl: string[];
}

export interface CompassionRewrite {
  originalTone: string;
  rewrittenEntry: string;
  whatChanged: string;
}

export interface DeeperQuestions {
  questions: string[];
  invitationNote: string;
}

export interface UpliftingReflection {
  reflection: string;
  gentleReminder: string;
}

export interface AIJournalResponse {
  mode: AIJournalMode;
  hasCrisisLanguage: boolean;
  safetyPrompt?: string;
  data:
    | EmotionIdentification
    | EmotionSuggestion[]
    | ThoughtSummary
    | UpliftingReflection
    | CompassionRewrite
    | DeeperQuestions;
}

// Simplified emotions wheel categories
export const EMOTION_CATEGORIES = {
  joy: ['Happy', 'Grateful', 'Peaceful', 'Content', 'Excited', 'Hopeful', 'Proud'],
  sadness: ['Sad', 'Lonely', 'Disappointed', 'Hurt', 'Grieving', 'Vulnerable'],
  anger: ['Angry', 'Frustrated', 'Annoyed', 'Resentful', 'Bitter'],
  fear: ['Anxious', 'Worried', 'Scared', 'Overwhelmed', 'Insecure', 'Uncertain'],
  disgust: ['Disgusted', 'Uncomfortable', 'Aversion', 'Repulsed'],
  surprise: ['Surprised', 'Confused', 'Amazed', 'Shocked'],
  shame: ['Ashamed', 'Embarrassed', 'Guilty', 'Inadequate'],
  love: ['Loving', 'Caring', 'Compassionate', 'Tender', 'Affectionate'],
};

// Crisis keywords to watch for
export const CRISIS_KEYWORDS = [
  'kill myself',
  'end my life',
  'suicide',
  'self harm',
  'want to die',
  'no reason to live',
  'better off dead',
];
