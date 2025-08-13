import { openai, isAIEnabled } from './client';
import { getEnv } from '@theglobalconnect/config';
import { OpenAI } from 'openai';

const env = getEnv();

const SUPPORT_SYSTEM_PROMPT = `You are a helpful customer support assistant for TheGlobalConnect, a social media platform.

Guidelines:
- Be friendly, professional, and empathetic
- Help users with platform features, account issues, and general questions
- Do NOT provide legal advice
- Do NOT access or modify user accounts or data
- Respect user privacy - never ask for passwords or sensitive information
- If you cannot help with something, politely explain limitations and suggest contacting human support
- Keep responses concise but helpful
- Focus on TheGlobalConnect platform features:
  - Posts and sharing
  - Friend connections
  - Chat and messaging
  - Profile management
  - Privacy settings
  - Reporting content
  - General platform navigation

If asked about other topics outside platform support, politely redirect to platform-related help.`;

export async function generateSupportResponse(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  onChunk?: (chunk: string) => void
): Promise<string | null> {
  if (!isAIEnabled() || !openai) {
    return "I'm sorry, but AI support is currently unavailable. Please contact our human support team for assistance.";
  }

  try {
    const completion = await openai.chat.completions.create({
      model: env.OPENAI_MODEL_CHAT,
      messages: [
        { role: 'system', content: SUPPORT_SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 500,
      temperature: 0.7,
      stream: !!onChunk,
    });

    if (onChunk) {
      let fullResponse = '';
      const stream = completion as AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>;
      
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          onChunk(content);
        }
      }
      
      return fullResponse;
    } else {
      const response = completion as OpenAI.Chat.Completions.ChatCompletion;
      return response.choices[0]?.message?.content || null;
    }
  } catch (error) {
    console.error('Error generating support response:', error);
    return "I'm experiencing technical difficulties. Please try again later or contact our human support team.";
  }
}

export async function categorizeSupportQuery(query: string): Promise<{
  category: string;
  priority: 'low' | 'medium' | 'high';
  needsHuman: boolean;
}> {
  if (!isAIEnabled() || !openai) {
    return {
      category: 'general',
      priority: 'medium',
      needsHuman: false,
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: env.OPENAI_MODEL_CHAT,
      messages: [
        {
          role: 'system',
          content: `Categorize this support query and return a JSON response with:
          - category: account, privacy, technical, billing, content, or general
          - priority: low, medium, or high
          - needsHuman: true if requires human intervention
          
          High priority: account security, harassment, payment issues
          Needs human: legal issues, complex account problems, billing disputes`,
        },
        {
          role: 'user',
          content: query,
        },
      ],
      max_tokens: 100,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      try {
        return JSON.parse(content);
      } catch {
        // Fallback if JSON parsing fails
      }
    }
  } catch (error) {
    console.error('Error categorizing support query:', error);
  }

  return {
    category: 'general',
    priority: 'medium',
    needsHuman: false,
  };
}