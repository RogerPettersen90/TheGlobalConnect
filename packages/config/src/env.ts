import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  
  // Redis
  REDIS_URL: z.string().url(),
  
  // NextAuth
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url().optional(),
  
  // OAuth Providers
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  
  // OpenAI
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL_CHAT: z.string().default('gpt-3.5-turbo'),
  OPENAI_MODEL_MODERATION: z.string().default('text-moderation-latest'),
  OPENAI_MODEL_EMBEDDINGS: z.string().default('text-embedding-3-small'),
  ENABLE_AI: z.string().transform(val => val === 'true').default('false'),
  
  // Storage
  S3_ENDPOINT: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_BUCKET_NAME: z.string().optional(),
  S3_REGION: z.string().default('us-east-1'),
  
  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default(3000),
  WS_PORT: z.string().transform(Number).default(3001),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default(15 * 60 * 1000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default(100),
  
  // Feature Flags
  ENABLE_REGISTRATION: z.string().transform(val => val !== 'false').default('true'),
  ENABLE_EMAIL_VERIFICATION: z.string().transform(val => val === 'true').default('false'),
});

export type Environment = z.infer<typeof envSchema>;

export function validateEnv(): Environment {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('Environment validation failed:', error);
    process.exit(1);
  }
}

export function getEnv(): Environment {
  return validateEnv();
}