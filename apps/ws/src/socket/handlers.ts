import { Server } from 'socket.io';
import { SOCKET_EVENTS } from '@theglobalconnect/config';
import { AuthenticatedSocket } from '../middleware/auth';
import { chatHandlers } from './chat';
import { presenceHandlers } from './presence';
import { notificationHandlers } from './notification';
import { setUserPresence } from '../lib/redis';

export function setupSocketHandlers(io: Server) {
  io.on(SOCKET_EVENTS.CONNECTION, (socket: AuthenticatedSocket) => {
    console.log(`User ${socket.user.handle} connected`);

    // Set user as online
    setUserPresence(socket.userId, 'online');

    // Setup handlers
    chatHandlers(io, socket);
    presenceHandlers(io, socket);
    notificationHandlers(io, socket);

    socket.on(SOCKET_EVENTS.DISCONNECT, async () => {
      console.log(`User ${socket.user.handle} disconnected`);
      await setUserPresence(socket.userId, 'offline');
      
      // Broadcast user offline status to relevant rooms
      socket.broadcast.emit(SOCKET_EVENTS.USER_OFFLINE, {
        userId: socket.userId,
      });
    });

    // Broadcast user online status
    socket.broadcast.emit(SOCKET_EVENTS.USER_ONLINE, {
      userId: socket.userId,
      user: socket.user,
    });
  });
}