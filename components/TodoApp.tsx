'use client';

import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { fetchTodos, addTodo, deleteTodo, HttpError, updateTodo } from '@/lib/api';
import type { Todo } from '@/lib/api';
import AuthButton from '@/components/AuthButton';
import TodoForm from '@/components/TodoForm';

import {
  DndContext,
  closestCenter,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent
} from '@dnd-kit/core';
import type { DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { SortableContainer } from '@/components/SortableContainer';
import { Item } from '@/components/SortableItem';

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

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
    } catch (err: unknown) {
      if (err instanceof HttpError && err.status === 401) {
        window.location.href = '/login';
      }
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

  function findContainer(id: string) {
    const validContainers = ['todo', 'in-progress', 'done'];
    const found = todos.find(({ id: todoId }) => id === todoId);

    return validContainers.includes(id) ? id : found?.state;
  }

  function handleDragStart(e: DragStartEvent) {
    if (typeof e.active.id === 'string') {
      setActiveId(e.active.id);
    }
  }

  async function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    const activeContainer = findContainer(active?.id as string);
    const overContainer = findContainer(over?.id as string);

    if (!activeContainer || !overContainer || activeContainer !== overContainer) {
      return;
    }

    setTodos((prev) => {
      const activeId = active?.id;
      const overId = over?.id;
      if (!activeId || !overId || activeId === overId) return prev;
      const activeItemIndex = prev.findIndex(({ id: todoId }) => todoId === activeId);
      const overItemIndex = prev.findIndex(({ id: todoId }) => todoId === overId);

      return activeItemIndex === overItemIndex ? prev : arrayMove(prev, activeItemIndex, overItemIndex);
    });

    setActiveId(null);
  }

  async function handleDragOver(e: DragOverEvent) {
    const { over, active } = e;

    const activeContainer = findContainer(active?.id as string);
    const overContainer = findContainer(over?.id as string);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setTodos((prev) => {
      const found = prev.find((item) => item.id === active.id);
      if (!found || !over) return prev;

      const updatedItem = { ...found, state: overContainer };

      return prev.map((item) => (item.id === active.id ? updatedItem : item));
    });

    try {
      await updateTodo(active.id as string, { state: overContainer });
    } catch (error) {
      console.error('Failed to update todo state on drag over:', error);
    }
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
    { name: 'todo', entries: todos.filter((t) => t.state === 'todo') },
    { name: 'in-progress', entries: todos.filter((t) => t.state === 'in-progress') },
    { name: 'done', entries: todos.filter((t) => t.state === 'done') }
  ];

  const activeItem = todos.find((t) => t.id === activeId);

  return (
    <div className="flex max-w-4xl mx-auto flex-col min-h-screen">
      <header className="w-full mx-auto p-6">
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

      <section className="max-w-6xl w-full px-6 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
          >
            {groupedTodos.map(({ name, entries }) => (
              <SortableContainer key={name} title={name} items={entries} />
            ))}
            {activeItem && (
              <DragOverlay>
                <Item item={activeItem} />
              </DragOverlay>
            )}
          </DndContext>
        </div>
      </section>
    </div>
  );
}
