'use client';

import {useEffect, useState} from 'react';
import {fetchTodos, addTodo, deleteTodo, Todo} from '@/lib/api';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import AuthButton from '@/components/AuthButton';

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = unknown (loading)

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);

    if (token) {
      loadTodos();
    }
  }, []);

  async function loadTodos() {
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) {
      console.error('Failed to fetch todos:', err);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await addTodo(title);
    setTitle('');
    loadTodos();
  }

  async function handleDelete(id: number) {
    await deleteTodo(id);
    loadTodos();
  }


  if (isLoggedIn === null) {
    return <p>Loading...</p>;
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in to manage your todos</h1>
        <AuthButton />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Todo List</h1>
        <AuthButton />
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 mt-4">
        <Input
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button type="submit">Add</Button>
      </form>

      <div className="space-y-4 mt-6">
        {todos.map((todo) => (
          <Card key={todo.id} className="p-4 flex justify-between items-center">
            <span>{todo.title}</span>
            <div className="flex gap-2 items-center">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(todo.id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}

      </div>
    </div>
  );
}
