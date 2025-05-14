'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function AuthButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <Button onClick={isLoggedIn ? handleLogout : handleLogin}>
      {isLoggedIn ? 'Logout' : 'Login'}
    </Button>
  );
}
