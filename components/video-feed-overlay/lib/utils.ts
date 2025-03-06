import { Following } from "@/shared/hooks/useFollowingsFollowers";
import { Like } from "@/shared/types/like";

export const isItLiked = (likes: Like[], videoId: string, userId: string) => {
  return likes.find(
    (like) => like.video_id === videoId && userId === like.user_id
  );
};

export const isItFollowed = (
  following: Following[],
  user_id: string,
  video_user_id: string
) => {
  return following.find(
    (follower) =>
      follower.follower_user_id === user_id &&
      follower.followed_user_id === video_user_id
  );
};
