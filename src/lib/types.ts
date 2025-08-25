export type Message = {
  id?: string;
  role: 'user' | 'ai';
  content: string;
  createdAt?: Date;
};
