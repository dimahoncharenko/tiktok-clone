import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { useContext } from "react";

import { Header } from "@/components/header";
import { MenuItem } from "@/components/menu-item";
import { DISTRIBUTION_CONTEXT } from "@/shared/context/distribution-context";
import { FriendCard } from "@/components/friend-card";

export function InboxScreen() {
  const { friends } = useContext(DISTRIBUTION_CONTEXT.appStateContext);

  return (
    <SafeAreaView className="bg-white flex-1 items-center">
      <Header title="Inbox" color="black" classNames={{ root: "w-full" }} />
      <View className="px-5 w-full gap-3">
        <MenuItem
          passive={false}
          heading="New followers"
          content="Say hi"
          path="(inbox)/followers"
        />
        <MenuItem
          passive={false}
          heading="Activity"
          content="See what people are doing"
          path="(inbox)/activity"
          classes={{
            root: "mb-4",
          }}
          icon={MenuItem.ActivityIcon()}
        />
        {friends.map((friend) => (
          <FriendCard
            key={friend.id}
            user={friend.User}
            avatar={friend.avatar_uri}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}
