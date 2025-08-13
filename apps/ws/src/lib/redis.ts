import Redis from 'ioredis';
import { getEnv } from '@theglobalconnect/config';

const env = getEnv();

export const redisClient = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (error) => {
  console.error('Redis connection error:', error);
});

export const setUserPresence = async (userId: string, status: 'online' | 'offline') => {
  const key = `presence:${userId}`;
  if (status === 'online') {
    await redisClient.setex(key, 300, 'online'); // 5 minute expiry
  } else {
    await redisClient.del(key);
  }
};

export const getUserPresence = async (userId: string): Promise<'online' | 'offline'> => {
  const key = `presence:${userId}`;
  const status = await redisClient.get(key);
  return status === 'online' ? 'online' : 'offline';
};

export const setTypingIndicator = async (chatId: string, userId: string, isTyping: boolean) => {
  const key = `typing:${chatId}:${userId}`;
  if (isTyping) {
    await redisClient.setex(key, 10, 'typing'); // 10 second expiry
  } else {
    await redisClient.del(key);
  }
};

export const getTypingUsers = async (chatId: string): Promise<string[]> => {
  const pattern = `typing:${chatId}:*`;
  const keys = await redisClient.keys(pattern);
  return keys.map(key => key.split(':')[2]);
};