import { Like } from "@/shared/types/like";

export const isItLiked = (likes: Like[], videoId: string, userId: string) => {
  return likes.find(
    (like) => like.video_id === videoId && userId === like.user_id
  );
};
