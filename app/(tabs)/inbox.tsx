import { appStateContext } from "@/shared/context/app-state";
import { useContext } from "react";
import { Text, View } from "react-native";

export default function InboxScreen() {
  const { followers } = useContext(appStateContext);

  console.log(followers);

  return (
    <View className="bg-white flex-1 justify-center items-center">
      <Text className="text-black">Inbox</Text>
    </View>
  );
}
