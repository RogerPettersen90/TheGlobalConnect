import { z } from 'zod';

// User schemas
export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  handle: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  bio: z.string().max(500).optional(),
  password: z.string().min(8).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  coverUrl: z.string().url().optional(),
});

// Post schemas
export const createPostSchema = z.object({
  content: z.string().min(1).max(5000),
  media: z.array(z.object({
    url: z.string().url(),
    type: z.enum(['image', 'video']),
    width: z.number().optional(),
    height: z.number().optional(),
  })).optional(),
  visibility: z.enum(['public', 'friends', 'private']).default('public'),
});

export const updatePostSchema = z.object({
  content: z.string().min(1).max(5000).optional(),
  visibility: z.enum(['public', 'friends', 'private']).optional(),
});

// Comment schemas
export const createCommentSchema = z.object({
  content: z.string().min(1).max(2000),
  parentCommentId: z.string().optional(),
});

// Chat schemas
export const createChatSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  isGroup: z.boolean().default(false),
  memberIds: z.array(z.string()).min(1),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1).max(5000),
  media: z.array(z.object({
    url: z.string().url(),
    type: z.string(),
    size: z.number(),
    name: z.string(),
  })).optional(),
});

// Friendship schemas
export const createFriendRequestSchema = z.object({
  addresseeId: z.string(),
});

export const updateFriendRequestSchema = z.object({
  status: z.enum(['accepted', 'blocked']),
});

// Report schemas
export const createReportSchema = z.object({
  targetType: z.enum(['user', 'post', 'comment', 'message']),
  targetId: z.string(),
  reason: z.string().min(1).max(500),
});

// Search schemas
export const searchSchema = z.object({
  q: z.string().min(1),
  type: z.enum(['users', 'posts', 'all']).default('all'),
  limit: z.number().min(1).max(50).default(20),
  cursor: z.string().optional(),
});

// Pagination schemas
export const paginationSchema = z.object({
  limit: z.number().min(1).max(50).default(20),
  cursor: z.string().optional(),
});

// File upload schemas
export const fileUploadSchema = z.object({
  filename: z.string(),
  contentType: z.string(),
  size: z.number().max(10 * 1024 * 1024), // 10MB max
});

// AI schemas
export const aiComposeSchema = z.object({
  prompt: z.string().min(1).max(500),
  context: z.string().max(1000).optional(),
});

export const aiModerationSchema = z.object({
  content: z.string().min(1),
});

// Notification schemas
export const markNotificationReadSchema = z.object({
  notificationIds: z.array(z.string()),
});

// Export types
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type CreatePost = z.infer<typeof createPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;
export type CreateComment = z.infer<typeof createCommentSchema>;
export type CreateChat = z.infer<typeof createChatSchema>;
export type SendMessage = z.infer<typeof sendMessageSchema>;
export type CreateFriendRequest = z.infer<typeof createFriendRequestSchema>;
export type UpdateFriendRequest = z.infer<typeof updateFriendRequestSchema>;
export type CreateReport = z.infer<typeof createReportSchema>;
export type SearchQuery = z.infer<typeof searchSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
export type FileUpload = z.infer<typeof fileUploadSchema>;
export type AICompose = z.infer<typeof aiComposeSchema>;
export type AIModerationRequest = z.infer<typeof aiModerationSchema>;
export type MarkNotificationRead = z.infer<typeof markNotificationReadSchema>;