import { User } from "./user";

export type Video = {
  User: User;
  createdAt: string;
  id: string;
  signedUrl: string | null;
  title: string;
  uri: string;
  user_id: string;
};
