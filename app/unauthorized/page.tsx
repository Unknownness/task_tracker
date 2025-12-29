import Link from 'next/link';
import { Lock, LogIn, UserPlus } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock size={48} className="text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Authentication Required
        </h1>
        
        <p className="text-gray-600 mb-8">
          You need to be signed in to access this page. Please log in or create an account to continue.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <LogIn size={20} />
            <span>Sign In</span>
          </Link>
          
          <Link
            href="/register"
            className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <UserPlus size={20} />
            <span>Sign Up</span>
          </Link>
        </div>
        
        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
