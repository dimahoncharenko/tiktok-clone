import { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "@/components/header";
import { appStateContext } from "@/shared/context/app-state";
import { ActivityFeedItem } from "@/components/activity-feed-item";
import { Text, View } from "react-native";

export default function InboxScreen() {
  const { followers } = useContext(appStateContext);

  console.log(followers);

  return (
    <SafeAreaView className="bg-white flex-1 items-center">
      <Header title="Inbox" color="black" classNames={{ root: "w-full" }} />
      <View className="px-5 w-full">
        <ActivityFeedItem heading="New followers" content="Say hi" />
      </View>
    </SafeAreaView>
  );
}
