export type Todo = {
  id: string;
  title: string;
  state: string;
  completed: boolean;
};
export class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

const API_URL = 'http://localhost:3000/todos';

// Get token from localStorage
function getAuthHeader(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return token ? {Authorization: `Bearer ${token}`} : {};
}

export async function fetchTodos(): Promise<Todo[]> {
  const headers = getAuthHeader();

  const res = await fetch(API_URL, {
    cache: 'no-store',
    headers,
  });

  if (!res.ok) throw new HttpError('Failed to fetch todos', res.status);

  return res.json();
}

export async function addTodo(title: string): Promise<Todo> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
  };

  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({title, state: 'todo'}),
  });

  if (!res.ok) throw new HttpError('Failed to add todo', res.status);
  return res.json();
}

export async function deleteTodo(id: number): Promise<void> {
  const token = localStorage.getItem('access_token');
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}
