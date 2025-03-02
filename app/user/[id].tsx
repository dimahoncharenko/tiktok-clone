import { useLocalSearchParams } from "expo-router";
import { StatusBar, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "@/components/header";
import { useContext, useEffect, useState } from "react";
import { User } from "@/shared/types/user";
import { userService } from "@/shared/lib/user";
import { UserDetails } from "@/components/user-details";
import { appStateContext } from "@/shared/context/app-state";

export default function () {
  const params = useLocalSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const { following, followers } = useContext(appStateContext);

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
