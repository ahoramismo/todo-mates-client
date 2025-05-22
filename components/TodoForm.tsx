'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useAddTodo } from '@/hooks';

export default function TodoForm() {
  const [title, setTitle] = useState('');
  const { mutate: addTodo } = useAddTodo();

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) return;

    addTodo(title);
    setTitle('');
  }

  return (
    <form onSubmit={handleAdd} className="flex gap-2 mt-4">
      <Input placeholder="What needs to be done?" value={title} onChange={(e) => setTitle(e.target.value)} required={true} />
      <Button type="submit">Add</Button>
    </form>
  );
}
