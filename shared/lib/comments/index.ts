import { Comment } from "@/shared/types/comment";
import { InitService } from "../utils";

class CommentsService extends InitService {
  async getAllCommentsByVideoId(videoId: string) {
    const { data, error } = await this.client
      .from("Comment")
      .select("*")
      .eq("video_id", videoId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data as Comment[];
  }

  async getAllCommentsByUserId(userId: string) {
    const { data, error } = await this.client
      .from("Comment")
      .select("*")
      .eq("video_user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data as Comment[];
  }

  async postComment(userId: string, videoId: string, content: string) {
    const { error } = await this.client.from("Comment").insert({
      user_id: userId,
      video_id: videoId,
      content,
      video_user_id: userId,
    });

    if (error) throw error;
  }
}

export const commentsService = new CommentsService();
