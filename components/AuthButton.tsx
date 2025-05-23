'use client';

import { Button } from '@/components/ui/button';
import { logout } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return <Button onClick={handleLogout}>Logout</Button>;
}
