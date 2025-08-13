import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { getEnv } from '@theglobalconnect/config';
import { prisma } from '@theglobalconnect/db';

const env = getEnv();

export interface AuthenticatedSocket extends Socket {
  userId: string;
  user: {
    id: string;
    name: string;
    handle: string;
    email: string;
  };
}

export const authenticateSocket = async (socket: Socket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    // In a real app, verify JWT token
    // For demo purposes, we'll assume token is the user ID
    const decoded = jwt.verify(token, env.NEXTAUTH_SECRET) as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id || decoded.sub },
      select: {
        id: true,
        name: true,
        handle: true,
        email: true,
        suspended: true,
      },
    });

    if (!user || user.suspended) {
      return next(new Error('Authentication error: Invalid user'));
    }

    (socket as AuthenticatedSocket).userId = user.id;
    (socket as AuthenticatedSocket).user = user;
    
    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Authentication error'));
  }
};