'use client';

import { useState } from 'react';
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'sm' || breakpoint === 'md';

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden"
        >
          {isSidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </Navbar>

      <div className="flex h-[calc(100vh-4rem)]">
        <div
          className={`
            fixed inset-y-0 left-0 z-50 w-64 transform bg-gray-800 transition-transform duration-300 lg:relative lg:translate-x-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <Sidebar onClose={() => isMobile && setIsSidebarOpen(false)} />
        </div>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>

      <Toaster position="top-right" />
    </div>
  );
} 