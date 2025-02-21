'use client';

import { useOffline } from '@/hooks/useOffline';

export function OfflineIndicator() {
  const isOffline = useOffline();

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 right-4 rounded-lg bg-red-500 px-4 py-2 text-white shadow-lg">
      <p className="flex items-center">
        <span className="mr-2 h-2 w-2 rounded-full bg-white"></span>
        Sin conexión
      </p>
    </div>
  );
} 