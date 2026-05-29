// Zentrale Typdefinitionen für die Onboarding-App.
// Diese spiegeln die JSON-Strukturen wider, die das Node.js-Backend liefert.

export type Role = "user" | "admin";

export interface AuthUser {
  id: number;
  role: Role;
  department: string;
  contact_firstname: string;
  contact_lastname: string;
}

export interface LoginResponse {
  user: AuthUser;
  message?: string;
}

export interface Task {
  task_id: number;
  title: string;
  description: string;
  status: string; // "Erledigt" oder z.B. "Offen"
  priority: "niedrig" | "mittel" | "hoch" | string;
  category: string;
  category_color: string;
  color?: string;
}

export interface TaskCatalogItem {
  id: number;
  title: string;
}

export interface UserListItem {
  id: number;
  firstname: string;
  lastname: string;
  email?: string;
}

export interface Progress {
  total_tasks: number;
  completed_tasks: number;
}
