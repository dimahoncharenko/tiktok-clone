import { InitService } from "../utils";

class Like extends InitService {
  async likeVideo(video_id: string, user_id: string) {
    const { data, error } = await this.client
      .from("Like")
      .insert({ video_id, user_id, video_user_id: user_id })
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async removeLikeVideo(like_id: string) {
    const { data, error } = await this.client
      .from("Like")
      .delete()
      .eq("id", like_id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async getLikesByUser(user_id: string) {
    const { data, error } = await this.client
      .from("Like")
      .select("id, video_id, user_id")
      .eq("user_id", user_id);

    if (error) throw error;

    return data;
  }
}

export const likeService = new Like();
