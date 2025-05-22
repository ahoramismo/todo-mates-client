import { useEffect, useState } from 'react';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    console.log('...')
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  return { isLoggedIn };
}
