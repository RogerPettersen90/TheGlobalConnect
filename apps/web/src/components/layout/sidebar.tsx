'use client';

import { useSession, signOut } from 'next-auth/react';
import { Avatar } from '@theglobalconnect/ui';
import {
  HomeIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Profile', href: '/profile', icon: UserIcon },
  { name: 'Messages', href: '/messages', icon: ChatBubbleLeftRightIcon },
  { name: 'Notifications', href: '/notifications', icon: BellIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export function Sidebar() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:block hidden">
      <div className="flex flex-col h-full">
        <div className="flex items-center px-4 py-6 border-b border-gray-200">
          <Avatar
            src={session.user.image || ''}
            name={session.user.name || ''}
            size="lg"
            className="mr-3"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{session.user.name}</h3>
            <p className="text-sm text-gray-500">@{session.user.handle}</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </a>
          ))}
        </nav>

        <div className="px-4 py-6 border-t border-gray-200">
          <button
            onClick={() => signOut()}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
          >
            <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}