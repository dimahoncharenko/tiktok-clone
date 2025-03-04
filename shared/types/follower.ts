import { User } from "./user";

export type Follower = {
  id: string;
  created_at: string;
  follower_user_id: string;
  followed_user_id: string;
  User: User;
};
