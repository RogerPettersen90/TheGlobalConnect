import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@theglobalconnect/db';
import { createPostSchema } from '@theglobalconnect/config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '20');

    const posts = await prisma.post.findMany({
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            handle: true,
            avatarUrl: true,
            verified: true,
          },
        },
        reactions: {
          select: {
            id: true,
            type: true,
            userId: true,
          },
        },
        comments: {
          take: 3,
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                handle: true,
                avatarUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            reactions: true,
            comments: true,
          },
        },
      },
    });

    const hasNextPage = posts.length > limit;
    const postsToReturn = hasNextPage ? posts.slice(0, -1) : posts;
    const nextCursor = hasNextPage ? posts[posts.length - 2].id : null;

    return NextResponse.json({
      posts: postsToReturn,
      nextCursor,
      hasNextPage,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createPostSchema.parse(body);

    const post = await prisma.post.create({
      data: {
        content: validatedData.content,
        media: validatedData.media || [],
        visibility: validatedData.visibility,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            handle: true,
            avatarUrl: true,
            verified: true,
          },
        },
        reactions: true,
        _count: {
          select: {
            reactions: true,
            comments: true,
          },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}