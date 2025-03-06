import { DISTRIBUTION_CONTEXT } from "@/shared/context/distribution-context";
import { useContext } from "react";
import { Text, View } from "react-native";

export const FriendsScreen = () => {
  const { friends } = useContext(DISTRIBUTION_CONTEXT.appStateContext);

  return (
    <View className="bg-white flex-1 justify-center items-center">
      <Text className="text-black">Friends</Text>
    </View>
  );
};
