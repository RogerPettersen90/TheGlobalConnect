'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button, Textarea, Avatar, Card } from '@theglobalconnect/ui';
import { PhotoIcon } from '@heroicons/react/24/outline';

export function CreatePost() {
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          visibility: 'public',
        }),
      });

      if (response.ok) {
        setContent('');
        // Refresh feed or add optimistic update
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user) return null;

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-3">
          <Avatar
            src={session.user.image || ''}
            name={session.user.name || ''}
            size="default"
          />
          <div className="flex-1">
            <Textarea
              placeholder="What's happening?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border-none resize-none focus:ring-0"
              rows={3}
            />
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  <PhotoIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-700">Photo</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">
                  {content.length}/5000
                </span>
                <Button
                  type="submit"
                  disabled={!content.trim() || loading}
                  loading={loading}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Card>
  );
}