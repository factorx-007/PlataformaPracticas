'use client';

import { Inter } from 'next/font/google';
import Sidebar from './components/Sidebar';
import './blog-styles.css';

const inter = Inter({ subsets: ['latin'] });

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} container mx-auto min-h-screen max-w-7xl bg-gray-100`}>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
