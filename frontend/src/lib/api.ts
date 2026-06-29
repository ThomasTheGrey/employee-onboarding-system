// ---------------------------------------------------------------------------
// API-Service-Schicht
// ---------------------------------------------------------------------------
// Alle HTTP-Aufrufe zum Node.js-Backend werden hier gebündelt.
// Die Basis-URL kommt aus der Umgebungsvariable VITE_API_URL (siehe .env).
// So lassen sich Endpunkte zentral anpassen – die Komponenten bleiben sauber.
// ---------------------------------------------------------------------------

import type {
  LoginResponse,
  Progress,
  Role,
  Task,
  TaskCatalogItem,
  UserListItem,
} from "./types";

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "http://localhost:3000";

/** Kleiner Helper, der Fehlerantworten in echte Errors verwandelt. */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  // Für PUT ohne JSON-Body kann der Server auch leer antworten.
  const text = await res.text();
  const data = text ? (JSON.parse(text) as T & { message?: string }) : ({} as T);

  if (!res.ok) {
    const message =
      (data as { message?: string })?.message ??
      `Anfrage fehlgeschlagen (${res.status})`;
    throw new Error(message);
  }
  return data;
}

// --- Auth ------------------------------------------------------------------

export const login = (email: string, password: string) => {
  const payload = { email, password };

  console.log("CHECK API:", payload);

  return request<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// --- Tasks -----------------------------------------------------------------

export const getUserTasks = (userId: number) =>
  request<Task[]>(`/tasks/${userId}`);

export const getProgress = (userId: number) =>
  request<Progress>(`/tasks/progress/${userId}`);

export const completeTask = (userId: number, taskId: number) =>
  request<void>(`/tasks/${userId}/${taskId}`, { method: "PUT" });

export const getAllTasks = () => request<TaskCatalogItem[]>("/tasks");

export const createTask = (payload: {
  title: string;
  description: string;
  priority: string;
  category_id: number;
}) =>
  request<void>("/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const assignTask = (user_id: number, task_id: number) =>
  request<void>("/tasks/assign", {
    method: "POST",
    body: JSON.stringify({ user_id, task_id }),
  });

// --- Users -----------------------------------------------------------------

export const getAllUsers = () => request<UserListItem[]>("/users");

export const createUser = (payload: {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: Role;
  department_id: number;
  requestingRole: Role | null;
}) =>
  request<void>("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const deleteUser = (userId: number) =>
  request<void>(`/users/${userId}`, {
    method: "DELETE",
  });


