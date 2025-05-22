import { AuthProvider } from '../app/context/auth/AuthContext';
import './globals.css';

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <main className="container mx-auto ">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}