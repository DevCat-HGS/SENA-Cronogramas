import { Providers } from './providers';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { OfflineIndicator } from '@/components/shared/OfflineIndicator';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0284c7" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Providers>
          <ProtectedRoute>{children}</ProtectedRoute>
          <Toaster position="top-right" />
          <OfflineIndicator />
        </Providers>
      </body>
    </html>
  );
} 