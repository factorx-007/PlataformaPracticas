'use client';
import { SessionProvider } from 'next-auth/react';

export default function NextAuthSessionProvider({ children, session = null }) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}
