export const APP_NAME = 'TheGlobalConnect';
export const APP_DESCRIPTION = 'Connect with people around the world';

export const FRIENDSHIP_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  BLOCKED: 'BLOCKED',
} as const;

export const REACTION_TYPE = {
  LIKE: 'LIKE',
} as const;

export const POST_VISIBILITY = {
  PUBLIC: 'public',
  FRIENDS: 'friends',
  PRIVATE: 'private',
} as const;

export const NOTIFICATION_TYPE = {
  FRIEND_REQUEST: 'friend_request',
  FRIEND_ACCEPT: 'friend_accept',
  POST_LIKE: 'post_like',
  POST_COMMENT: 'post_comment',
  COMMENT_REPLY: 'comment_reply',
  MESSAGE: 'message',
  MENTION: 'mention',
} as const;

export const CHAT_MEMBER_ROLE = {
  MEMBER: 'member',
  ADMIN: 'admin',
  OWNER: 'owner',
} as const;

export const AI_FLAG_CATEGORY = {
  HATE: 'hate',
  HARASSMENT: 'harassment',
  SELF_HARM: 'self-harm',
  SEXUAL: 'sexual',
  VIOLENCE: 'violence',
  SPAM: 'spam',
} as const;

export const REPORT_REASON = {
  SPAM: 'spam',
  HARASSMENT: 'harassment',
  HATE_SPEECH: 'hate_speech',
  VIOLENCE: 'violence',
  SEXUAL_CONTENT: 'sexual_content',
  MISINFORMATION: 'misinformation',
  OTHER: 'other',
} as const;

export const FILE_UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES_PER_POST: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/plain'],
} as const;

export const RATE_LIMITS = {
  AUTH_ATTEMPTS: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 5,
  },
  API_REQUESTS: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },
  MESSAGE_SENDING: {
    windowMs: 60 * 1000, // 1 minute
    maxMessages: 30,
  },
  POST_CREATION: {
    windowMs: 60 * 1000, // 1 minute
    maxPosts: 5,
  },
  AI_REQUESTS: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 50,
  },
} as const;

export const PAGINATION_DEFAULTS = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 50,
} as const;

export const SOCKET_EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  SEND_MESSAGE: 'send_message',
  NEW_MESSAGE: 'new_message',
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',
  USER_TYPING: 'user_typing',
  MESSAGE_READ: 'message_read',
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',
  NOTIFICATION: 'notification',
} as const;

export const REDIS_KEYS = {
  USER_SESSION: (userId: string) => `session:${userId}`,
  USER_PRESENCE: (userId: string) => `presence:${userId}`,
  TYPING: (chatId: string, userId: string) => `typing:${chatId}:${userId}`,
  RATE_LIMIT: (key: string) => `rate_limit:${key}`,
  NOTIFICATION_COUNT: (userId: string) => `notifications:${userId}:count`,
} as const;