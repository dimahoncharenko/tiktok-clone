import { User } from "@/shared/types/user";
import { InitService } from "../utils";
import { Follower } from "@/shared/types/follower";
import { Following } from "@/shared/types/follower";

type UserRecordParams = {
  email: string;
  id: string;
  username: string;
  avatar_uri?: string;
};

class UserService extends InitService {
  async getAllUsers() {
    const { data, error } = await this.client.from("User").select("*");

    if (error) throw error;

    return data as User[];
  }

  async updateUser({
    id,
    ...params
  }: { id: string } & Partial<Omit<UserRecordParams, "id">>) {
    const { error } = await this.client
      .from("User")
      .update(params)
      .eq("id", id);

    if (error) throw error;
  }

  async getUser(id: string) {
    const { data, error } = await this.client
      .from("User")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;

    return data as User;
  }

  async addUser({ email, id, username }: UserRecordParams) {
    const { error } = await this.client.from("User").insert({
      email,
      id,
      username,
    });

    if (error) throw error;
  }

  async getUsersByName(name: string) {
    const { data, error } = await this.client
      .from("User")
      .select("*")
      .like("username", `%${name}%`);

    if (error) throw error;

    return data as User[];
  }

  async followUser(followed_user_id: string, follower_user_id: string) {
    const { error } = await this.client.from("Follower").insert({
      follower_user_id,
      followed_user_id,
    });

    if (error) throw error;
  }

  async unfollowUser(followed_user_id: string, follower_user_id: string) {
    const { error } = await this.client
      .from("Follower")
      .delete()
      .eq("follower_user_id", follower_user_id)
      .eq("followed_user_id", followed_user_id);

    if (error) throw error;
  }

  async getFollowers(user_id: string) {
    const { data, error } = await this.client
      .from("Follower")
      .select("*, User(*)")
      .eq("followed_user_id", user_id);

    if (error) throw error;

    return data as Follower[];
  }

  async getFollowings(user_id: string) {
    const { data, error } = await this.client
      .from("Follower")
      .select("*")
      .eq("follower_user_id", user_id);

    if (error) throw error;

    return data as Following[];
  }
}

export const userService = new UserService();
