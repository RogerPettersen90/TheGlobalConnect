import { Server } from 'socket.io';
import { SOCKET_EVENTS } from '@theglobalconnect/config';
import { AuthenticatedSocket } from '../middleware/auth';
import { prisma } from '@theglobalconnect/db';
import { setTypingIndicator, getTypingUsers } from '../lib/redis';

export function chatHandlers(io: Server, socket: AuthenticatedSocket) {
  
  socket.on(SOCKET_EVENTS.JOIN_ROOM, async (data: { chatId: string }) => {
    try {
      const { chatId } = data;
      
      // Verify user is member of the chat
      const chatMember = await prisma.chatMember.findUnique({
        where: {
          chatId_userId: {
            chatId,
            userId: socket.userId,
          },
        },
      });

      if (!chatMember) {
        socket.emit('error', { message: 'Not authorized to join this chat' });
        return;
      }

      socket.join(chatId);
      console.log(`User ${socket.user.handle} joined chat ${chatId}`);

      // Send chat history
      const messages = await prisma.message.findMany({
        where: { chatId },
        take: 50,
        orderBy: { createdAt: 'desc' },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              handle: true,
              avatarUrl: true,
            },
          },
        },
      });

      socket.emit('chat_history', {
        chatId,
        messages: messages.reverse(),
      });

    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error', { message: 'Failed to join chat' });
    }
  });

  socket.on(SOCKET_EVENTS.LEAVE_ROOM, (data: { chatId: string }) => {
    const { chatId } = data;
    socket.leave(chatId);
    console.log(`User ${socket.user.handle} left chat ${chatId}`);
  });

  socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (data: {
    chatId: string;
    content: string;
    media?: Array<{
      url: string;
      type: string;
      size: number;
      name: string;
    }>;
  }) => {
    try {
      const { chatId, content, media = [] } = data;

      // Verify user is member of the chat
      const chatMember = await prisma.chatMember.findUnique({
        where: {
          chatId_userId: {
            chatId,
            userId: socket.userId,
          },
        },
      });

      if (!chatMember) {
        socket.emit('error', { message: 'Not authorized to send messages in this chat' });
        return;
      }

      // Create message
      const message = await prisma.message.create({
        data: {
          chatId,
          senderId: socket.userId,
          content,
          media,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              handle: true,
              avatarUrl: true,
            },
          },
        },
      });

      // Broadcast to chat room
      io.to(chatId).emit(SOCKET_EVENTS.NEW_MESSAGE, message);

      // Update chat's updatedAt
      await prisma.chat.update({
        where: { id: chatId },
        data: { updatedAt: new Date() },
      });

      // Clear typing indicator
      await setTypingIndicator(chatId, socket.userId, false);
      const typingUsers = await getTypingUsers(chatId);
      io.to(chatId).emit(SOCKET_EVENTS.USER_TYPING, {
        chatId,
        typingUsers: typingUsers.filter(id => id !== socket.userId),
      });

    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on(SOCKET_EVENTS.TYPING_START, async (data: { chatId: string }) => {
    const { chatId } = data;
    
    await setTypingIndicator(chatId, socket.userId, true);
    const typingUsers = await getTypingUsers(chatId);
    
    socket.to(chatId).emit(SOCKET_EVENTS.USER_TYPING, {
      chatId,
      typingUsers,
    });
  });

  socket.on(SOCKET_EVENTS.TYPING_STOP, async (data: { chatId: string }) => {
    const { chatId } = data;
    
    await setTypingIndicator(chatId, socket.userId, false);
    const typingUsers = await getTypingUsers(chatId);
    
    socket.to(chatId).emit(SOCKET_EVENTS.USER_TYPING, {
      chatId,
      typingUsers,
    });
  });

  socket.on(SOCKET_EVENTS.MESSAGE_READ, async (data: { 
    chatId: string; 
    messageId: string; 
  }) => {
    try {
      const { chatId, messageId } = data;

      // Update message read status
      await prisma.message.update({
        where: { id: messageId },
        data: { readAt: new Date() },
      });

      // Broadcast read receipt to chat
      socket.to(chatId).emit('message_read', {
        messageId,
        readBy: socket.userId,
        readAt: new Date(),
      });

    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  });
}