'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { shallow } from 'zustand/shallow';
import { useStoreWithEqualityFn } from 'zustand/traditional';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useStoreWithEqualityFn(useStore, (state) => state.user, shallow);
  const fetchUser = useStore((state) => state.fetchUser);
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
