import OpenAI from 'openai';
import { getEnv } from '@theglobalconnect/config';

const env = getEnv();

export const openai = env.OPENAI_API_KEY ? new OpenAI({
  apiKey: env.OPENAI_API_KEY,
}) : null;

export const isAIEnabled = () => {
  return env.ENABLE_AI && !!env.OPENAI_API_KEY;
};