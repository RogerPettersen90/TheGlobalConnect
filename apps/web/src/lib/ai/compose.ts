import { openai, isAIEnabled } from './client';
import { getEnv } from '@theglobalconnect/config';

const env = getEnv();

export async function generateSmartCompose(
  prompt: string,
  context?: string
): Promise<string | null> {
  if (!isAIEnabled() || !openai) {
    return null;
  }

  try {
    const systemPrompt = `You are a helpful writing assistant for a social media platform. 
    Help users compose engaging, positive, and authentic posts and comments. 
    Keep responses concise (under 280 characters for posts, under 100 characters for comments).
    Avoid controversial topics, hate speech, or harmful content.
    Be conversational and natural.`;

    const userPrompt = context 
      ? `Context: ${context}\n\nHelp me write: ${prompt}`
      : `Help me write: ${prompt}`;

    const response = await openai.chat.completions.create({
      model: env.OPENAI_MODEL_CHAT,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 150,
      temperature: 0.7,
      frequency_penalty: 0.3,
      presence_penalty: 0.3,
    });

    return response.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('Error generating smart compose:', error);
    return null;
  }
}

export async function generatePostSummary(content: string): Promise<string | null> {
  if (!isAIEnabled() || !openai) {
    return null;
  }

  try {
    const response = await openai.chat.completions.create({
      model: env.OPENAI_MODEL_CHAT,
      messages: [
        {
          role: 'system',
          content: 'Create a brief, engaging summary of this social media content in 1-2 sentences. Focus on the main point or key insight.',
        },
        {
          role: 'user',
          content: content,
        },
      ],
      max_tokens: 100,
      temperature: 0.5,
    });

    return response.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('Error generating post summary:', error);
    return null;
  }
}