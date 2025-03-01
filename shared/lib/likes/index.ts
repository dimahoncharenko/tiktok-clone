import { InitService } from "../utils";

class Like extends InitService {
  async likeVideo(video_id: string, user_id: string) {
    const { data, error } = await this.client
      .from("Like")
      .insert({ video_id, user_id, video_user_id: user_id })
      .select()
      .limit(1);

    if (error) throw error;
    return data;
  }

  async removeLikeVideo(video_id: string, user_id: string) {
    const { error } = await this.client
      .from("Like")
      .delete()
      .eq("user_id", user_id)
      .eq("video_id", video_id);

    if (error) throw error;
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
