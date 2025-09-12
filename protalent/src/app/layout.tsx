import { AuthProvider } from '../app/context/auth/AuthContext';
import NextAuthSessionProvider from './providers/SessionProvider';
import './globals.css';

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body suppressHydrationWarning={true}>
        <NextAuthSessionProvider>
          <AuthProvider>
            <main>{children}</main>
          </AuthProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}