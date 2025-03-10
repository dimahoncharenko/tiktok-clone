import { SafeAreaView } from "react-native-safe-area-context";
import { Image, View, VirtualizedList } from "react-native";
import { useRouter } from "expo-router";
import { useContext } from "react";

import { DISTRIBUTION_CONTEXT } from "@/shared/context/distribution-context";
import { MenuItem } from "@/components/menu-item";
import { Header } from "@/components/header";
import { FollowerWithAvatar } from "@/shared/hooks/useFollowingsFollowers";

export function FollowersScreen() {
  const { followers } = useContext(DISTRIBUTION_CONTEXT.appStateContext);
  const router = useRouter();

  return (
    <SafeAreaView className="bg-white">
      <Header title="Followers" enableTurnBack color="black" />
      <VirtualizedList
        data={followers}
        keyExtractor={(item: FollowerWithAvatar) => item.id.toString()}
        getItemCount={() => followers.length}
        getItem={(followers, index) => followers[index]}
        className="h-full px-5 gap-2"
        renderItem={({ item }) => (
          <MenuItem
            passive={false}
            func={() =>
              router.push({
                pathname: "/user/[id]",
                params: { id: item.follower_user_id },
              })
            }
            heading={item.User.username}
            content="Say hi"
            classes={{
              root: "py-1",
            }}
            icon={
              <View>
                <Image
                  source={{
                    uri: item.avatar_uri || "https://placehold.co/40x40",
                  }}
                  className="size-12 bg-black rounded-full"
                />
              </View>
            }
          />
        )}
      />
    </SafeAreaView>
  );
}
