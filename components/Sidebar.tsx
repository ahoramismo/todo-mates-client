'use client';

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Menu, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { logout } from '@/lib/api';
import { useRouter } from 'next/navigation';

export function Sidebar() {
  const { setTheme, resolvedTheme } = useTheme();
  const [confirmOnDelete, setConfirmOnDelete] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const value = localStorage.getItem('confirmOnDelete') === 'true';
    setConfirmOnDelete(value);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const toggleConfirmDelete = () => {
    const next = !confirmOnDelete;
    setConfirmOnDelete(next);
    localStorage.setItem('confirmOnDelete', String(next));
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Customize your preferences below.
          </SheetDescription>
        </SheetHeader>

        <div className="grid flex-1 auto-rows-min gap-6 px-4 py-4">
          <div className="grid gap-3">
            <Label>Dark Mode</Label>
            <div className="flex items-center justify-between">
              <span>{resolvedTheme === 'dark' ? 'Dark' : 'Light'}</span>
              <Switch
                checked={resolvedTheme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Confirm before delete</Label>
            <div className="flex items-center justify-between">
              <span>{confirmOnDelete ? 'On' : 'Off'}</span>
              <Switch
                checked={confirmOnDelete}
                onCheckedChange={toggleConfirmDelete}
              />
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button
            variant="destructive"
            className="w-full flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
