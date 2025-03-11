import { View } from "react-native";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "@/components/header";
import { userService } from "@/shared/lib/user";
import { Button } from "@/shared/ui-blocks/button";
import { UserDetails } from "@/components/user-details";
import { useAuthContext } from "@/shared/context/auth-provider";
import { useFollowingsFollowers } from "@/shared/hooks/useFollowingsFollowers";
import { useQuery } from "@tanstack/react-query";
import { FollowStatus, isItFollowed } from "../lib/utils";
import { DISTRIBUTION_CONTEXT } from "@/shared/context/distribution-context";
import { useIsCurrentTab } from "@/shared/hooks/useIsCurrentTab";

type Props = {
  user_id: string;
};

export function UserScreen({ user_id }: Props) {
  const { user: authUser } = useAuthContext();
  const { data: user } = useQuery({
    queryKey: ["user", user_id],
    queryFn: async () => {
      return await userService.getUser(user_id);
    },
  });

  const {
    followers,
    getFollowers,
    getFollowings,
    unfollowUser,
    followUser,
    following,
  } = useFollowingsFollowers();

  const { likes } = useContext(DISTRIBUTION_CONTEXT.appStateContext);

  const isCurrentPath = useIsCurrentTab(`/user/${user_id}`);

  const { getLikesByVideoUser } = useContext(
    DISTRIBUTION_CONTEXT.appActionsContext
  );

  const followStatus = new FollowStatus(followers, user?.id, authUser?.id);

  const [isFollowed, setIsFollowed] = useState(isItFollowed(followStatus));

  useEffect(() => {
    if (!isCurrentPath) return;

    (async () => {
      if (!user) return;

      try {
        await getLikesByVideoUser(user);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [user, isCurrentPath]);

  useEffect(() => {
    setIsFollowed(isItFollowed(followStatus));
  }, [followers.length]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      await getFollowers(user.id);
      await getFollowings(user.id);
    })();
  }, [user]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Username" color="black" />
      {user && authUser && (
        <View className="flex-1">
          <UserDetails
            followers={followers.length}
            following={following.length}
            user={user}
            likesCount={likes.length}
          />
          {isFollowed ? (
            <Button
              labelClasses="text-white font-semibold text-2xl"
              className="bg-black py-2 h-14 mb-10 mx-4"
              label="Unfollow"
              onPress={async () => {
                await unfollowUser(authUser, user.id);
                setIsFollowed(false);
              }}
            />
          ) : (
            <Button
              labelClasses="text-white font-semibold text-2xl"
              className="bg-black py-2 h-14 mb-10 mx-4"
              label="Follow"
              onPress={async () => {
                await followUser(authUser, user.id);
                setIsFollowed(true);
              }}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
