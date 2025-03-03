import {
  Image,
  Text,
  TouchableOpacity,
  View,
  VirtualizedList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useContext } from "react";

import { Header } from "@/components/header";
import { appStateContext } from "@/shared/context/app-state";
import { Follower } from "@/shared/types/follower";

export default function () {
  const { followers } = useContext(appStateContext);
  const router = useRouter();

  return (
    <SafeAreaView className="bg-white">
      <Header title="Followers" enableTurnBack color="black" />
      <VirtualizedList
        data={followers}
        keyExtractor={(item: Follower) => item.id.toString()}
        getItemCount={() => followers.length}
        getItem={(followers, index) => followers[index]}
        className="h-full px-5 gap-2"
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row gap-3"
            onPress={() =>
              router.push({
                pathname: "/user/[id]",
                params: { id: item.user_id },
              })
            }
          >
            <View>
              <Image
                source={{ uri: "https://placehold.co/40x40" }}
                className="size-10 bg-black rounded-full"
              />
            </View>
            <View>
              <Text className="text-sm font-medium text-gray-900">
                {item.User.username}
              </Text>
              <Text className="text-sm text-gray-500">Say hi</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
