'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import Link from 'next/link';
import { LayoutDashboard, StickyNote, ArrowRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user, fetchUser } = useStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  /*useEffect(() => {
    if (user) {
      router.push('/boards');
    }
  }, [user, router]);*/
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Task Tracker
          </h1>
          <p className="text-xl text-gray-600">
            Organize your work with Kanban boards and keep notes all in one place
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/boards"
            className="group bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
              <LayoutDashboard size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Kanban Boards</h2>
            <p className="text-gray-600 mb-4">
              Create boards, manage tasks, and track progress with drag-and-drop functionality
            </p>
            <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
              Get Started <ArrowRight size={20} className="ml-1" />
            </div>
          </Link>
          
          <Link
            href="/notes"
            className="group bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
              <StickyNote size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Notes</h2>
            <p className="text-gray-600 mb-4">
              Capture ideas, write documentation, and keep important information organized
            </p>
            <div className="flex items-center text-green-600 font-semibold group-hover:gap-2 transition-all">
              Get Started <ArrowRight size={20} className="ml-1" />
            </div>
          </Link>
        </div>
        
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Drag & Drop
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Auto-save
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Modern UI
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
