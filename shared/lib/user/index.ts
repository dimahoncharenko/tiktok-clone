import { InitService } from "../utils";

type UserRecordParams = {
  email: string;
  id: string;
  username: string;
};

class UserService extends InitService {
  async getUser(id: string) {
    const { data, error } = await this.client
      .from("User")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;

    return data;
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

    return data;
  }

  async followUser(user_id: string, follower_user_id: string) {
    const { error } = await this.client.from("Follower").insert({
      user_id,
      follower_user_id,
    });

    if (error) throw error;
  }

  async unfollowUser(user_id: string, follower_user_id: string) {
    const { error } = await this.client
      .from("Follower")
      .delete()
      .eq("user_id", user_id)
      .eq("follower_user_id", follower_user_id);

    if (error) throw error;
  }

  async getFollowers(user_id: string) {
    const { data, error } = await this.client
      .from("Follower")
      .select("*, User(*)")
      .eq("follower_user_id", user_id);

    if (error) throw error;

    return data;
  }

  async getFollowings(user_id: string) {
    const { data, error } = await this.client
      .from("Follower")
      .select("*")
      .eq("user_id", user_id);

    if (error) throw error;

    return data;
  }
}

export const userService = new UserService();
