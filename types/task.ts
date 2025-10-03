export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  created_at: string;
}
