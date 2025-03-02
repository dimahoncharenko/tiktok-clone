import { useRouter } from "expo-router";
import { useContext } from "react";

import { UserDetails } from "@/components/user-details";
import { useAuthContext } from "@/shared/context/AuthProvider";
import { appStateContext } from "@/shared/context/app-state";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/header";

export default function ProfileScreen() {
  const { user } = useAuthContext();
  const { following, followers } = useContext(appStateContext);
  const router = useRouter();

  if (!user) return router.replace("/(auth)");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Profile" color="black" />
      <UserDetails followers={followers.length} following={following.length} />
    </SafeAreaView>
  );
}
