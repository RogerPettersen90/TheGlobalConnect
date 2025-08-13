'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, Card, Button } from '@theglobalconnect/ui';
import {
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface PostCardProps {
  post: {
    id: string;
    content: string;
    createdAt: string;
    author: {
      id: string;
      name: string;
      handle: string;
      avatarUrl?: string;
      verified: boolean;
    };
    reactions: Array<{ id: string; type: string; userId: string }>;
    comments: Array<{
      id: string;
      content: string;
      author: {
        id: string;
        name: string;
        handle: string;
        avatarUrl?: string;
      };
    }>;
    _count: {
      reactions: number;
      comments: number;
    };
  };
}

export function PostCard({ post }: PostCardProps) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(
    post.reactions.some(r => r.userId === session?.user?.id)
  );
  const [likeCount, setLikeCount] = useState(post._count.reactions);

  const handleLike = async () => {
    if (!session?.user) return;

    const wasLiked = isLiked;
    setIsLiked(!isLiked);
    setLikeCount(prev => wasLiked ? prev - 1 : prev + 1);

    try {
      const response = await fetch(`/api/posts/${post.id}/reactions`, {
        method: wasLiked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'LIKE' }),
      });

      if (!response.ok) {
        // Revert optimistic update
        setIsLiked(wasLiked);
        setLikeCount(prev => wasLiked ? prev + 1 : prev - 1);
      }
    } catch (error) {
      // Revert optimistic update
      setIsLiked(wasLiked);
      setLikeCount(prev => wasLiked ? prev + 1 : prev - 1);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex space-x-3">
        <Avatar
          src={post.author.avatarUrl}
          name={post.author.name}
          size="default"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-semibold text-gray-900">
              {post.author.name}
            </h3>
            {post.author.verified && (
              <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            <span className="text-sm text-gray-500">@{post.author.handle}</span>
            <span className="text-sm text-gray-500">·</span>
            <time className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </time>
          </div>
          
          <div className="mt-2">
            <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
          </div>

          <div className="mt-4 flex items-center justify-between max-w-md">
            <button
              onClick={handleLike}
              className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
            >
              {isLiked ? (
                <HeartSolidIcon className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
              <span className="text-sm">{likeCount}</span>
            </button>

            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
              <ChatBubbleOvalLeftIcon className="h-5 w-5" />
              <span className="text-sm">{post._count.comments}</span>
            </button>

            <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
              <ShareIcon className="h-5 w-5" />
              <span className="text-sm">Share</span>
            </button>
          </div>

          {post.comments.length > 0 && (
            <div className="mt-4 space-y-3">
              {post.comments.slice(0, 2).map((comment) => (
                <div key={comment.id} className="flex space-x-2">
                  <Avatar
                    src={comment.author.avatarUrl}
                    name={comment.author.name}
                    size="sm"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-sm">{comment.author.name}</span>
                    <span className="text-gray-500 text-sm ml-2">@{comment.author.handle}</span>
                    <p className="text-sm text-gray-900 mt-1">{comment.content}</p>
                  </div>
                </div>
              ))}
              
              {post._count.comments > 2 && (
                <button className="text-sm text-blue-600 hover:text-blue-500">
                  View all {post._count.comments} comments
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}