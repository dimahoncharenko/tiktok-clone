import {
  FollowerWithAvatar,
  FollowingWithAvatar,
} from "@/shared/hooks/useFollowingsFollowers";
import { SameAs } from "@/shared/types";

export type Friend = SameAs<FollowerWithAvatar>;

export const calculateFriends = (
  following: FollowingWithAvatar[],
  followers: FollowerWithAvatar[]
): Friend[] => {
  let friends = new Set<Friend>();

  following.forEach((following) =>
    followers.forEach(
      (follower) =>
        following.follower_user_id === follower.followed_user_id &&
        friends.add(follower)
    )
  );

  return [...friends] as Friend[];
};
