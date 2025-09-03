export type Message = {
  id?: string;
  role: 'user' | 'ai';
  content?: string;
  createdAt?: Date;
  title: string;
  description?: string;
  start: string; // ISO string
  end?: string; // ISO string
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
};

// export interface Event {
//   title: string;
//   description?: string;
//   start: string; // ISO string
//   end?: string; // ISO string
//   allDay?: boolean;
//   backgroundColor?: string;
//   borderColor?: string;
//   textColor?: string;
//   createdAt?: string; // optional when sending to frontend
// }
