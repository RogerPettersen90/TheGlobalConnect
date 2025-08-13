const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// Demo page HTML
const demoHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TheGlobalConnect - Social Platform</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen">
        <div class="max-w-4xl mx-auto py-8 px-4">
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">
                    🌍 TheGlobalConnect
                </h1>
                <p class="text-xl text-gray-600">
                    Production-ready social platform with AI features
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h3 class="text-lg font-semibold mb-3">🔐 Authentication</h3>
                    <ul class="text-sm text-gray-600 space-y-1">
                        <li>• NextAuth.js with multiple providers</li>
                        <li>• Google & GitHub OAuth</li>
                        <li>• Secure JWT sessions</li>
                        <li>• User profiles & friend system</li>
                    </ul>
                </div>

                <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h3 class="text-lg font-semibold mb-3">💬 Real-time Chat</h3>
                    <ul class="text-sm text-gray-600 space-y-1">
                        <li>• Socket.IO WebSocket server</li>
                        <li>• 1:1 and group chats</li>
                        <li>• Typing indicators</li>
                        <li>• Read receipts & presence</li>
                    </ul>
                </div>

                <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h3 class="text-lg font-semibold mb-3">🤖 AI Features</h3>
                    <ul class="text-sm text-gray-600 space-y-1">
                        <li>• Smart Compose with OpenAI</li>
                        <li>• Content moderation</li>
                        <li>• Post summarization</li>
                        <li>• AI support assistant</li>
                    </ul>
                </div>

                <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h3 class="text-lg font-semibold mb-3">📱 Social Features</h3>
                    <ul class="text-sm text-gray-600 space-y-1">
                        <li>• Posts with media uploads</li>
                        <li>• Like/reaction system</li>
                        <li>• Threaded comments</li>
                        <li>• Personalized feed</li>
                    </ul>
                </div>

                <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h3 class="text-lg font-semibold mb-3">🔍 Search & Discovery</h3>
                    <ul class="text-sm text-gray-600 space-y-1">
                        <li>• Full-text search</li>
                        <li>• User & post discovery</li>
                        <li>• Advanced filtering</li>
                        <li>• Trending content</li>
                    </ul>
                </div>

                <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h3 class="text-lg font-semibold mb-3">🛡️ Security & Privacy</h3>
                    <ul class="text-sm text-gray-600 space-y-1">
                        <li>• Redis rate limiting</li>
                        <li>• Input sanitization</li>
                        <li>• GDPR compliance</li>
                        <li>• Content reporting</li>
                    </ul>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6 mb-8">
                <h2 class="text-2xl font-bold mb-4">🏗️ Technical Stack</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <h4 class="font-semibold mb-2">Frontend</h4>
                        <ul class="text-sm text-gray-600">
                            <li>Next.js 14</li>
                            <li>React 18</li>
                            <li>TypeScript</li>
                            <li>Tailwind CSS</li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-2">Backend</h4>
                        <ul class="text-sm text-gray-600">
                            <li>Node.js</li>
                            <li>Express</li>
                            <li>Socket.IO</li>
                            <li>NextAuth.js</li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-2">Database</h4>
                        <ul class="text-sm text-gray-600">
                            <li>PostgreSQL</li>
                            <li>Prisma ORM</li>
                            <li>Redis cache</li>
                            <li>Full-text search</li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-2">Deployment</h4>
                        <ul class="text-sm text-gray-600">
                            <li>Railway</li>
                            <li>Docker</li>
                            <li>GitHub Actions</li>
                            <li>Monitoring</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="bg-blue-50 rounded-lg p-6 text-center">
                <h2 class="text-xl font-bold text-blue-900 mb-4">🚀 Production Ready</h2>
                <p class="text-blue-700 mb-4">
                    Complete social media platform deployed and running!
                </p>
                <div class="space-x-4">
                    <a 
                        href="https://github.com/RogerPettersen90/TheGlobalConnect" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        View Source Code
                    </a>
                    <a 
                        href="https://railway.app" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="inline-block border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        Deploy Your Own
                    </a>
                </div>
                <div class="mt-4">
                    <p class="text-sm text-blue-600">
                        ✅ Built with Next.js 14 • ✅ Production Ready • ✅ Scalable Architecture
                    </p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;

app.get('/', (req, res) => {
    res.send(demoHTML);
});

app.get('/demo', (req, res) => {
    res.send(demoHTML);
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
    console.log(\`🚀 TheGlobalConnect demo running at http://localhost:\${port}\`);
});