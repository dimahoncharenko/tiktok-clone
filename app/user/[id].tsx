import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "@/components/header";
import { useEffect, useState } from "react";
import { User } from "@/shared/types/user";
import { userService } from "@/shared/lib/user";
import { UserDetails } from "@/components/user-details";
import { useFollowingsFollowers } from "@/shared/hooks/useFollowingsFollowers";

export default function () {
  const params = useLocalSearchParams();
  const [user, setUser] = useState<User | null>(null);

  const { getFollowers, getFollowings, followers, following } =
    useFollowingsFollowers();

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

  useEffect(() => {
    if (!user) return;
    (async () => {
      await getFollowers(user);
      await getFollowings(user);
    })();
  }, [user]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Username" color="black" />
      {user && (
        <UserDetails
          followers={followers.length}
          following={following.length}
          user={user}
        />
      )}
    </SafeAreaView>
  );
}
