import { User } from "./user";

export type ChatMessage = {
  User: User;
  chat_user_id: string;
  user_id: string;
  content: string;
  id: string;
  created_at: string;
  users_key: string;
};
