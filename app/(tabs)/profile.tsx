import { useContext, useEffect } from "react";

import { UserDetails } from "@/components/user-details";
import { useAuthContext } from "@/shared/context/auth-provider";
import { DISTRIBUTION_CONTEXT } from "@/shared/context/distribution-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/header";

export default function ProfileScreen() {
  const { user } = useAuthContext();
  const { following, followers } = useContext(
    DISTRIBUTION_CONTEXT.appStateContext
  );

  const { getFollowers, getFollowings } = useContext(
    DISTRIBUTION_CONTEXT.appActionsContext
  );

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
      <UserDetails followers={followers.length} following={following.length} />
    </SafeAreaView>
  );
}
