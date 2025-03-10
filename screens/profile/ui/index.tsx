import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useEffect } from "react";

import { DISTRIBUTION_CONTEXT } from "@/shared/context/distribution-context";
import { useAuthContext } from "@/shared/context/auth-provider";
import { UserDetails } from "@/components/user-details";
import { Header } from "@/components/header";
import { useIsCurrentTab } from "@/shared/hooks/useIsCurrentTab";

export function ProfileScreen() {
  const { user } = useAuthContext();
  const isCurrentPath = useIsCurrentTab("/profile");
  const { following, followers, likes } = useContext(
    DISTRIBUTION_CONTEXT.appStateContext
  );

  const { getFollowers, getFollowings, getLikesByVideoUser } = useContext(
    DISTRIBUTION_CONTEXT.appActionsContext
  );

  useEffect(() => {
    if (!user || !isCurrentPath) return;

    (async () => {
      try {
        await getLikesByVideoUser(user);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [isCurrentPath, user]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      await getFollowers(user.id);
      await getFollowings(user.id);
    })();
  }, [user]);

  if (!user) return null;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Profile" color="black" />
      <UserDetails
        followers={followers.length}
        following={following.length}
        likesCount={likes.length}
      />
    </SafeAreaView>
  );
}
