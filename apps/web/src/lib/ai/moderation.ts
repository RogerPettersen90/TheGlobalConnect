import { openai, isAIEnabled } from './client';
import { getEnv } from '@theglobalconnect/config';
import { prisma } from '@theglobalconnect/db';

const env = getEnv();

export interface ModerationResult {
  blocked: boolean;
  categories: string[];
  scores: Record<string, number>;
  flagged: boolean;
}

export async function moderateContent(
  content: string,
  targetType: 'post' | 'comment' | 'message',
  targetId: string
): Promise<ModerationResult> {
  if (!isAIEnabled() || !openai) {
    return {
      blocked: false,
      categories: [],
      scores: {},
      flagged: false,
    };
  }

  try {
    const response = await openai.moderations.create({
      input: content,
      model: env.OPENAI_MODEL_MODERATION,
    });

    const result = response.results[0];
    const blocked = result.flagged;
    const categories = Object.keys(result.categories).filter(
      key => result.categories[key as keyof typeof result.categories]
    );

    // Store AI flag in database
    if (blocked) {
      const highestScore = Math.max(...Object.values(result.category_scores));
      const primaryCategory = Object.keys(result.category_scores).find(
        key => result.category_scores[key as keyof typeof result.category_scores] === highestScore
      );

      await prisma.aIFlag.create({
        data: {
          targetType: targetType.toUpperCase() as any,
          targetId,
          category: mapModerationCategoryToEnum(primaryCategory || 'OTHER'),
          score: highestScore,
        },
      });
    }

    return {
      blocked,
      categories,
      scores: result.category_scores,
      flagged: result.flagged,
    };
  } catch (error) {
    console.error('Error in content moderation:', error);
    // Fail open - allow content if moderation fails
    return {
      blocked: false,
      categories: [],
      scores: {},
      flagged: false,
    };
  }
}

function mapModerationCategoryToEnum(category: string) {
  const mapping: Record<string, string> = {
    'hate': 'HATE',
    'harassment': 'HARASSMENT',
    'self-harm': 'SELF_HARM',
    'sexual': 'SEXUAL',
    'violence': 'VIOLENCE',
    'other': 'SPAM',
  };
  
  return mapping[category] || 'SPAM';
}