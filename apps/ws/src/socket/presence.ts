import { Server } from 'socket.io';
import { SOCKET_EVENTS } from '@theglobalconnect/config';
import { AuthenticatedSocket } from '../middleware/auth';
import { setUserPresence, getUserPresence } from '../lib/redis';

export function presenceHandlers(io: Server, socket: AuthenticatedSocket) {
  // User comes online
  socket.on('user_online', async () => {
    await setUserPresence(socket.userId, 'online');
    socket.broadcast.emit(SOCKET_EVENTS.USER_ONLINE, {
      userId: socket.userId,
      user: socket.user,
    });
  });

  // User goes offline
  socket.on('user_offline', async () => {
    await setUserPresence(socket.userId, 'offline');
    socket.broadcast.emit(SOCKET_EVENTS.USER_OFFLINE, {
      userId: socket.userId,
    });
  });

  // Get user presence
  socket.on('get_user_presence', async (data: { userId: string }) => {
    const presence = await getUserPresence(data.userId);
    socket.emit('user_presence', {
      userId: data.userId,
      status: presence,
    });
  });
}