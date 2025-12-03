import { NextRequest, NextResponse } from 'next/server';
import { getPromptForMode } from '@/lib/journalAIPrompts';
import { CRISIS_KEYWORDS, type AIJournalMode, type AIJournalResponse } from '@/types/journalAI';

/**
 * POST /api/journal-ai
 * Process journal entry with AI assistance
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entry, mode } = body;

    // Validate inputs
    if (!entry || typeof entry !== 'string') {
      return NextResponse.json(
        { error: 'Journal entry is required' },
        { status: 400 }
      );
    }

    if (!mode || !['understand-feelings', 'emotion-wheel', 'make-sense', 'uplift', 'compassion-rewrite', 'deeper-questions'].includes(mode)) {
      return NextResponse.json(
        { error: 'Valid mode is required' },
        { status: 400 }
      );
    }

    // Check for crisis language
    const hasCrisisLanguage = checkForCrisisLanguage(entry);

    // Get the appropriate prompt
    const prompt = getPromptForMode(mode as AIJournalMode, entry);

    // Call AI service (OpenAI example - you can swap for Anthropic Claude)
    const aiResponse = await callAIService(prompt);

    // Parse the response
    let data;
    try {
      data = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return NextResponse.json(
        { error: 'Failed to process AI response' },
        { status: 500 }
      );
    }

    // Build response
    const response: AIJournalResponse = {
      mode: mode as AIJournalMode,
      hasCrisisLanguage,
      safetyPrompt: hasCrisisLanguage
        ? 'If you are feeling unsafe or in crisis, please reach out to a professional or emergency support. You deserve care and support right now.'
        : undefined,
      data,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in journal AI endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process journal entry';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * Check if entry contains crisis language
 */
function checkForCrisisLanguage(entry: string): boolean {
  const lowerEntry = entry.toLowerCase();
  return CRISIS_KEYWORDS.some(keyword => lowerEntry.includes(keyword));
}

/**
 * Call AI service (OpenAI GPT-4 example)
 * Replace with Anthropic Claude if preferred
 */
async function callAIService(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('AI API key not configured');
  }

  // Example using OpenAI
  if (process.env.OPENAI_API_KEY) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a gentle, warm journaling companion. Always respond in valid JSON format as specified in the prompt.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI service error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  // Example using Anthropic Claude (alternative)
  if (process.env.ANTHROPIC_API_KEY) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`AI service error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  throw new Error('No AI service configured');
}
