'use client';

import { useEffect, useState } from 'react';
import { Todo, updateTodo } from '@/lib/api';
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
import { useAuth, useTodos } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';

export default function TodoApp() {
  const queryClient = useQueryClient();
  const { data: todos = [] } = useTodos();
  const { isLoggedIn } = useAuth();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const findContainer = (id: string) => {
    const validStates = ['todo', 'in-progress', 'done'];
    if (validStates.includes(id)) return id;
    return todos?.find((todo) => todo.id === id)?.state;
  };

  function handleDragStart(e: DragStartEvent) {
    if (typeof e.active.id === 'string') {
      setActiveId(e.active.id);
    }
  }

  function getContainerAndId(e: DragEndEvent | DragOverEvent) {
    const activeId = String(e.active?.id);
    const overId = String(e.over?.id);
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    return { activeId, overId, activeContainer, overContainer };
  }

  /**
   * TODO: support persistent re-ordering items in the same container
   */
  async function handleDragEnd(e: DragEndEvent) {
    const { activeId, overId, activeContainer, overContainer } = getContainerAndId(e);

    if (!activeContainer || !overContainer || activeContainer !== overContainer || activeId === overId) {
      setActiveId(null);
      return;
    }

    queryClient.setQueryData<Todo[]>(['todos'], (old = []) => {
      const fromIndex = old.findIndex((todo) => todo.id === activeId);
      const toIndex = old.findIndex((todo) => todo.id === overId);

      if (fromIndex === -1 || toIndex === -1) return old;
      return arrayMove(old, fromIndex, toIndex);
    });

    setActiveId(null);
  }

  async function handleDragOver(e: DragOverEvent) {
    const { activeId, activeContainer, overContainer } = getContainerAndId(e);

    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    queryClient.setQueryData<Todo[]>(['todos'], (old = []) => {
      const todo = old.find((t) => t.id === activeId);
      if (!todo) return old;

      const updated = { ...todo, state: overContainer };
      return old.map((t) => (t.id === activeId ? updated : t));
    });

    try {
      await updateTodo(activeId, { state: overContainer });
    } catch (error) {
      console.error('Failed to update todo state on drag over:', error);
    }
  }

  useEffect(() => {
    if (isLoggedIn === false) {
      window.location.href = '/login';
    }
  }, [isLoggedIn]);

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

        <TodoForm />
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
