'use client';

import { useState, useEffect } from 'react';
import { PostCard } from './post-card';

interface Post {
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
}

export function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      
      const data = await response.json();
      setPosts(data.posts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 bg-gray-300 rounded-full" />
                <div>
                  <div className="h-4 bg-gray-300 rounded w-24 mb-2" />
                  <div className="h-3 bg-gray-300 rounded w-16" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-full" />
                <div className="h-4 bg-gray-300 rounded w-3/4" />
                <div className="h-4 bg-gray-300 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">Error loading posts: {error}</p>
        <button
          onClick={fetchPosts}
          className="mt-2 text-blue-600 hover:text-blue-500"
        >
          Try again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
        <p className="text-gray-500 mt-1">
          Be the first to share something with the community!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}