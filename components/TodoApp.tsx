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

  // Group todos by state
  const groupedTodos = {
    todo: todos.filter((t) => t.state === 'todo'),
    inProgress: todos.filter((t) => t.state === 'in-progress'),
    done: todos.filter((t) => t.state === 'done'),
  };

  return (
    <div>
      <header className="max-w-4xl mx-auto p-6">
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
      </header>

      <section className="max-w-6xl mx-auto px-6 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Todo</h2>
            <div className="space-y-4">
              {groupedTodos.todo.map((todo) => (
                <Card key={todo.id} className="p-4 flex justify-between items-center">
                  <span>{todo.title}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(todo.id)}
                  >
                    Delete
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">In Progress</h2>
            <div className="space-y-4">
              {groupedTodos.inProgress.map((todo) => (
                <Card key={todo.id} className="p-4 flex justify-between items-center">
                  <span>{todo.title}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(todo.id)}
                  >
                    Delete
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Done</h2>
            <div className="space-y-4">
              {groupedTodos.done.map((todo) => (
                <Card key={todo.id} className="p-4 flex justify-between items-center">
                  <span>{todo.title}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(todo.id)}
                  >
                    Delete
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
