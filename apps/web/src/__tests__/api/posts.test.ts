import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/posts/route';

// Mock dependencies
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@theglobalconnect/db', () => ({
  prisma: {
    post: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

const mockSession = {
  user: {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
  },
};

describe('/api/posts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/posts', () => {
    it('should return posts with pagination', async () => {
      const { getServerSession } = await import('next-auth');
      const { prisma } = await import('@theglobalconnect/db');

      const mockPosts = [
        {
          id: 'post-1',
          content: 'Test post 1',
          createdAt: new Date(),
          author: { id: 'user-1', name: 'Test User', handle: 'testuser' },
          reactions: [],
          comments: [],
          _count: { reactions: 0, comments: 0 },
        },
      ];

      vi.mocked(prisma.post.findMany).mockResolvedValue(mockPosts);

      const request = new NextRequest('http://localhost:3000/api/posts');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.posts).toEqual(mockPosts);
      expect(data.hasNextPage).toBe(false);
    });

    it('should handle cursor pagination', async () => {
      const { prisma } = await import('@theglobalconnect/db');

      vi.mocked(prisma.post.findMany).mockResolvedValue([]);

      const request = new NextRequest('http://localhost:3000/api/posts?cursor=post-123&limit=10');
      const response = await GET(request);

      expect(prisma.post.findMany).toHaveBeenCalledWith({
        take: 11,
        cursor: { id: 'post-123' },
        skip: 1,
        orderBy: { createdAt: 'desc' },
        include: expect.any(Object),
      });
    });
  });

  describe('POST /api/posts', () => {
    it('should create a new post when authenticated', async () => {
      const { getServerSession } = await import('next-auth');
      const { prisma } = await import('@theglobalconnect/db');

      vi.mocked(getServerSession).mockResolvedValue(mockSession);

      const newPost = {
        id: 'post-new',
        content: 'New test post',
        authorId: 'user-1',
        createdAt: new Date(),
        author: mockSession.user,
        reactions: [],
        _count: { reactions: 0, comments: 0 },
      };

      vi.mocked(prisma.post.create).mockResolvedValue(newPost as any);

      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify({
          content: 'New test post',
          visibility: 'public',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.content).toBe('New test post');
      expect(prisma.post.create).toHaveBeenCalledWith({
        data: {
          content: 'New test post',
          media: [],
          visibility: 'public',
          authorId: 'user-1',
        },
        include: expect.any(Object),
      });
    });

    it('should return 401 when not authenticated', async () => {
      const { getServerSession } = await import('next-auth');

      vi.mocked(getServerSession).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify({ content: 'Test post' }),
      });

      const response = await POST(request);

      expect(response.status).toBe(401);
    });
  });
});