export type Todo = {
  id: string;
  title: string;
  state: string;
  completed?: boolean;
  order?: number;
};
export type CreateDto = Partial<Pick<Todo, 'title' | 'state'>>;
export type UpdateDto = Pick<Todo, 'id'> & Partial<Omit<Todo, 'id'>>;

export class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

const API_BASE = 'http://localhost:3000';
const TODO_BASE = `${API_BASE}/todos`;
const AUTH_BASE = `${API_BASE}/auth`;

export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch(TODO_BASE, {
    cache: 'no-store',
    credentials: 'include'
  });

  if (!res.ok) throw new HttpError('Failed to fetch todos', res.status);

  return res.json();
}

export async function addTodo(title: string): Promise<Todo> {
  const headers = {
    'Content-Type': 'application/json'
  };

  const res = await fetch(TODO_BASE, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify({ title, state: 'todo' })
  });

  if (!res.ok) throw new HttpError('Failed to add todo', res.status);
  return res.json();
}

export async function deleteTodo(id: string): Promise<void> {
  await fetch(`${TODO_BASE}/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
}

export async function reorderTodosOnServer(newOrder: string[]) {
  return await fetch(`${TODO_BASE}/reorder`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ids: newOrder })
  });
}

export async function updateTodo(todo: UpdateDto): Promise<void> {
  await fetch(`${TODO_BASE}/${todo.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(todo)
  });
}

export async function toggleTodo(item: Todo): Promise<void> {
  await fetch(`${TODO_BASE}/${item.id}/toggle-completed`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
}



export async function register(username: string, password: string) {
  return fetch(`${AUTH_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
}

export async function login(username: string, password: string) {
  return fetch(`${AUTH_BASE}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
}

export async function logout() {
  return fetch(`${AUTH_BASE}/logout`, {
    method: 'POST',
    credentials: 'include'
  });
}
