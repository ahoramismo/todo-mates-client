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

import type { DragEndEvent } from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  SortableContext,
  arrayMove
} from '@dnd-kit/sortable';
import { Item, SortableItem } from '@/components/SortableItem';
import { useAuth, useTodos, useReorderTodos } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { Todo } from '@/lib/api';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { Sidebar } from '@/components/Sidebar';

export default function TodoApp() {
  const queryClient = useQueryClient();
  const { data: todos = [] } = useTodos();
  const { isLoggedIn } = useAuth();
  const [activeId, setActiveId] = useState<string | null>(null);
  const { mutate: reorderTodo } = useReorderTodos();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

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

    const todos = queryClient.getQueryData<Todo[]>(['todos']) ?? [];

    const oldIndex = todos.findIndex((todo) => todo.id === active.id);
    const newIndex = todos.findIndex((todo) => todo.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      console.warn('Invalid drag IDs', { active, over });
      return;
    }

    const reorderedTodos = arrayMove(todos, oldIndex, newIndex);
    const reorderedIds = reorderedTodos.map((todo) => todo.id);

    reorderTodo(reorderedIds);
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
          <div className="flex items-center gap-2">
            <Sidebar />
          </div>
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
        >
          <SortableContext items={todos.map(({ id }) => id)} strategy={verticalListSortingStrategy}>
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
              <Item item={activeItem} />
            )}
          </DragOverlay>
        </DndContext>
      </section>
    </div>
  );
}
