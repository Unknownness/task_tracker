'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, fetchUser } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await fetchUser();
      setLoading(false);
    };
    checkAuth();
  }, [fetchUser]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/unauthorized');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
