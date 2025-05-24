'use client';

import { useState } from 'react';
import AuthButton from '@/components/AuthButton';
import TodoForm from '@/components/TodoForm';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverlay
} from '@dnd-kit/core';

import type { DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  SortableContext,
  arrayMove
} from '@dnd-kit/sortable';
import { SortableItem } from '@/components/SortableItem';
import { useAuth, useTodos } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { Todo } from '@/lib/api';

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

  const handleDragCancel = () => {
    setActiveId(null);
  };

  /**
   * TODO: support persistent re-ordering items in the same container
   */
  async function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    queryClient.setQueryData<Todo[]>(['todos'], (old = []) => {
      // const oldIndex = old.findIndex((todo) => todo.id === active.id);
      // const newIndex = old.findIndex((todo) => todo.id === over.id);
      // if (oldIndex === -1 || newIndex === -1) {
      //   return old;
      // }
      return old;
      // return arrayMove(old, oldIndex, newIndex);
    });

    // mutation.mutate(
    //   queryClient.getQueryData<Todo[]>(['todos'])?.map((todo) => todo.id) || []
    // );
  }

  async function handleDragOver(e: DragOverEvent) {
    const { active, over } = e;

    if (!over || active.id === over.id) return;

    queryClient.setQueryData<Todo[]>(['todos'], (old = []) => {
      const oldIndex = old.findIndex((todo) => todo.id === active.id);
      const newIndex = old.findIndex((todo) => todo.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return old;

      return arrayMove(old, oldIndex, newIndex);
    });
  }

  if (isLoggedIn === null) {
    return <p>Loading...</p>;
  }

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <SortableContext items={todos.map(({ title }) => title)} strategy={verticalListSortingStrategy}>
            <div>
              <div className="space-y-4">
                {todos.map((item) => (
                  <SortableItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </SortableContext>
          <DragOverlay>
            {activeItem && (
              <div className="flex items-center gap-2 rounded-xl border p-2 shadow-md bg-white">
                <span className="i-lucide-grip-vertical cursor-grab" />
                <span className="line-clamp-1">{activeItem.title}</span>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </section>
    </div>
  );
}
