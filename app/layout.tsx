import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { LayoutDashboard, StickyNote } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Task Tracker - Kanban & Notes',
  description: 'Modern task tracking with Kanban boards and notes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="text-xl font-bold text-gray-800">Task Tracker</span>
              </Link>
              
              <div className="flex space-x-4">
                <Link
                  href="/boards"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                >
                  <LayoutDashboard size={20} />
                  <span>Boards</span>
                </Link>
                <Link
                  href="/notes"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                >
                  <StickyNote size={20} />
                  <span>Notes</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>
        
        <main>{children}</main>
      </body>
    </html>
  );
}
