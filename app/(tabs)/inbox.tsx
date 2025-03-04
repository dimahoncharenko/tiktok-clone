import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";

import { Header } from "@/components/header";
import { MenuItem } from "@/components/menu-item";

export default function InboxScreen() {
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
          icon={MenuItem.ActivityIcon()}
        />
      </View>
    </SafeAreaView>
  );
}
