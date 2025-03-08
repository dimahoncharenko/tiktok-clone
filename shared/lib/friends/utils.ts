import { Following } from "@/shared/hooks/useFollowingsFollowers";
import { SameAs } from "@/shared/types";
import { Follower } from "@/shared/types/follower";

export type Friend = SameAs<Follower>;

export const calculateFriends = (
  following: Following[],
  followers: Follower[]
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
