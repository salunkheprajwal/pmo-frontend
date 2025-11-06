'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToken } from './TokenContext';

export function useAuthProtection() {
  const { token } = useToken();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If we're on an authenticated route and there's no token, redirect to login
    if (!token && pathname?.startsWith('/authenticated')) {
      router.push('/auth/login');
    }
    // If we're on login page and have a token, redirect to dashboard
    else if (token && pathname === '/auth/login') {
      router.push('/authenticated/dashboard');
    }
  }, [token, pathname, router]);

  return token;
}