import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { getEnv } from '@theglobalconnect/config';
import { setupSocketHandlers } from './socket/handlers';
import { authenticateSocket } from './middleware/auth';
import { redisClient } from './lib/redis';

const env = getEnv();
const app = express();
const server = createServer(app);

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:3000'],
  credentials: true,
}));

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-domain.com'] 
      : ['http://localhost:3000'],
    credentials: true,
  },
  transports: ['websocket'],
});

// Middleware
io.use(authenticateSocket);

// Socket handlers
setupSocketHandlers(io);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
server.listen(env.WS_PORT, () => {
  console.log(`WebSocket server running on port ${env.WS_PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    redisClient.disconnect();
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    redisClient.disconnect();
    process.exit(0);
  });
});