export type Todo = {
  id: string;
  title: string;
  state: string;
};
export type UpdateDto = Partial<Pick<Todo, 'title' | 'state'>>;

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

export async function updateTodo(id: string, todo: UpdateDto): Promise<void> {
  const headers = {
    'Content-Type': 'application/json'
  };

  await fetch(`${TODO_BASE}/${id}`, {
    method: 'PATCH',
    headers,
    credentials: 'include',
    body: JSON.stringify(todo)
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
