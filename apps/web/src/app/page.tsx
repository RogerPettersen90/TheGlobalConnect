import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Feed } from '@/components/feed/feed';
import { Sidebar } from '@/components/layout/sidebar';
import { CreatePost } from '@/components/posts/create-post';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64">
          <div className="max-w-2xl mx-auto py-8 px-4">
            <CreatePost />
            <div className="mt-6">
              <Feed />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}