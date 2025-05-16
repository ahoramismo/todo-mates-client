'use client';

import {ChangeEvent, useEffect, useState} from 'react';
import {fetchTodos, addTodo, deleteTodo, Todo} from '@/lib/api';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import AuthButton from '@/components/AuthButton';
import TodoForm from "@/components/TodoForm";

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

  // Group todos by state
  const groupedTodos = [
    {name: 'todo', entries: todos.filter((t) => t.state === 'todo'),},
    {name: 'in-progress', entries: todos.filter((t) => t.state === 'in-progress'),},
    {name: 'done', entries: todos.filter((t) => t.state === 'done'),}
  ]

  return (
    <div>
      <header className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Todo List</h1>
          <AuthButton />
        </div>

        <TodoForm
          onSubmit={(e) => handleAdd(e)}
          title={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        />
      </header>

      <section className="max-w-6xl mx-auto px-6 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {groupedTodos.map((group) => (
            <div key={group.name}>
              <h2 className="text-xl font-semibold mb-4">Todo</h2>
              <div className="space-y-4">
                {group.entries.map((item) => (
                  <Card key={item.id} className="p-4 flex justify-between items-center">
                    <span>{item.title}</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
