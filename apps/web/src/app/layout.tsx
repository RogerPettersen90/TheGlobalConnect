import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from './providers/session-provider';
import { SocketProvider } from './providers/socket-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TheGlobalConnect - Connect with people around the world',
  description: 'A modern social platform for global connections',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </SessionProvider>
      </body>
    </html>
  );
}