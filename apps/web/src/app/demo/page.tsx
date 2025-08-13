import { Card } from '@theglobalconnect/ui';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🌍 TheGlobalConnect
          </h1>
          <p className="text-xl text-gray-600">
            Production-ready social platform with AI features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">🔐 Authentication</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• NextAuth.js with multiple providers</li>
              <li>• Google & GitHub OAuth</li>
              <li>• Secure JWT sessions</li>
              <li>• User profiles & friend system</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">💬 Real-time Chat</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Socket.IO WebSocket server</li>
              <li>• 1:1 and group chats</li>
              <li>• Typing indicators</li>
              <li>• Read receipts & presence</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">🤖 AI Features</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Smart Compose with OpenAI</li>
              <li>• Content moderation</li>
              <li>• Post summarization</li>
              <li>• AI support assistant</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">📱 Social Features</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Posts with media uploads</li>
              <li>• Like/reaction system</li>
              <li>• Threaded comments</li>
              <li>• Personalized feed</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">🔍 Search & Discovery</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Full-text search</li>
              <li>• User & post discovery</li>
              <li>• Advanced filtering</li>
              <li>• Trending content</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">🛡️ Security & Privacy</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Redis rate limiting</li>
              <li>• Input sanitization</li>
              <li>• GDPR compliance</li>
              <li>• Content reporting</li>
            </ul>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">🏗️ Technical Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Frontend</h4>
              <ul className="text-sm text-gray-600">
                <li>Next.js 14</li>
                <li>React 18</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Backend</h4>
              <ul className="text-sm text-gray-600">
                <li>Node.js</li>
                <li>Express</li>
                <li>Socket.IO</li>
                <li>NextAuth.js</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Database</h4>
              <ul className="text-sm text-gray-600">
                <li>PostgreSQL</li>
                <li>Prisma ORM</li>
                <li>Redis cache</li>
                <li>Full-text search</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Deployment</h4>
              <ul className="text-sm text-gray-600">
                <li>Railway</li>
                <li>Docker</li>
                <li>GitHub Actions</li>
                <li>Monitoring</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-blue-900 mb-4">🚀 Ready to Deploy</h2>
          <p className="text-blue-700 mb-4">
            This is a complete, production-ready social platform. Deploy to Railway in minutes!
          </p>
          <div className="space-x-4">
            <a 
              href="https://railway.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Deploy to Railway
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}