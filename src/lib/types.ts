export type Message = {
  id?: string;
  role: 'user' | 'ai';
  content?: string;
  createdAt?: Date;
  title?: string;
  description?: string;
  start: string | Date; // ISO string
  end?: string; // ISO string
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  category?: string;
  tasks?: Event[]; // Array of tasks for AI messages
};

export interface Event {
  id?: string;
  title: string;
  description?: string;
  start: string; // ISO string
  end?: string; // ISO string
  category: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  createdAt?: string;
  isComplete?: boolean; // optional when sending to frontend
}

export type CategoryType =
  | 'Health/Fitness'
  | 'Learning/Books'
  | 'Work/Productivity'
  | 'Personal/Creative'
  | 'Chores/Errands'
  | 'Social/Leisure'
  | 'Break';
