import { Like } from "@/shared/types/like";
import { InitService } from "../utils";
import { Video } from "@/shared/types/video";

class LikeService extends InitService {
  async likeVideo(video: Video, user_id: string) {
    const { data, error } = await this.client
      .from("Like")
      .insert({ video_id: video.id, user_id, video_user_id: video.User.id })
      .select()
      .limit(1);

    if (error) throw error;
    return data as [Like];
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
      .select("*")
      .eq("user_id", user_id);

    if (error) throw error;

    return data as Like[];
  }

  async getLikesByVideoUser(user_id: string) {
    const { data, error } = await this.client
      .from("Like")
      .select("*")
      .eq("video_user_id", user_id);

    if (error) throw error;

    return data as Like[];
  }
}

export const likeService = new LikeService();
