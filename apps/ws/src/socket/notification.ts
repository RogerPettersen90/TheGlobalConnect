import { Server } from 'socket.io';
import { SOCKET_EVENTS } from '@theglobalconnect/config';
import { AuthenticatedSocket } from '../middleware/auth';

export function notificationHandlers(io: Server, socket: AuthenticatedSocket) {
  // Join user's notification room
  socket.join(`notifications:${socket.userId}`);

  // Mark notifications as read
  socket.on('mark_notifications_read', (data: { notificationIds: string[] }) => {
    // In a real app, you'd update the database here
    socket.emit('notifications_marked_read', {
      notificationIds: data.notificationIds,
    });
  });

  // Send notification to specific user
  socket.on('send_notification', (data: {
    targetUserId: string;
    type: string;
    data: any;
  }) => {
    io.to(`notifications:${data.targetUserId}`).emit(SOCKET_EVENTS.NOTIFICATION, {
      type: data.type,
      data: data.data,
      senderId: socket.userId,
      timestamp: new Date(),
    });
  });
}