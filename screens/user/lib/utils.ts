import { Follower } from "@/shared/types/follower";

export class FollowStatus {
  public followers: Follower[];
  public profileId?: string;
  public userId?: string;

  constructor(followers: Follower[], profileId?: string, userId?: string) {
    this.followers = followers;
    this.profileId = profileId;
    this.userId = userId;
  }
}

export const isItFollowed = (status: FollowStatus) => {
  return !!status.followers.find(
    (follower) =>
      follower.followed_user_id === status?.profileId &&
      follower.follower_user_id === status?.userId
  );
};
