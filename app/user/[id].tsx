import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { User } from "@/shared/types/user";
import { Header } from "@/components/header";
import { userService } from "@/shared/lib/user";
import { Button } from "@/shared/ui-blocks/button";
import { UserDetails } from "@/components/user-details";
import { useAuthContext } from "@/shared/context/auth-provider";
import { useFollowingsFollowers } from "@/shared/hooks/useFollowingsFollowers";

export default function () {
  const params = useLocalSearchParams();
  const { user: authUser } = useAuthContext();
  const {
    followers,
    getFollowers,
    getFollowings,
    unfollowUser,
    followUser,
    following,
  } = useFollowingsFollowers();
  const [user, setUser] = useState<User | null>(null);
  const [isFollowed, setIsFollowed] = useState(
    !!followers.find(
      (follower) =>
        follower.followed_user_id === user?.id &&
        follower.follower_user_id === authUser?.id
    )
  );

  useEffect(() => {
    setIsFollowed(
      !!followers.find(
        (follower) =>
          follower.followed_user_id === user?.id &&
          follower.follower_user_id === authUser?.id
      )
    );
  }, [followers.length]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      await getFollowers(user.id);
      await getFollowings(user.id);
    })();
  }, [user]);

  useEffect(() => {
    if (!params.id) return;
    const id: string = params.id as unknown as string;

    (async () => {
      try {
        const res = await userService.getUser(id);
        setUser(res);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [params.id]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Username" color="black" />
      {user && authUser && (
        <View className="flex-1">
          <UserDetails
            followers={followers.length}
            following={following.length}
            user={user}
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
