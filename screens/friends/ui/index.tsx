import { usePathname } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Dimensions, Text, View, VirtualizedList } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { FeedVideo } from "@/components/feed-video";
import { Video } from "@/shared/types/video";
import { Header } from "@/components/header";
import { getVideosFromFriendsWithUrlsFromStorage } from "../lib";
import { DISTRIBUTION_CONTEXT } from "@/shared/context/distribution-context";

export function FriendsScreen() {
  const pathname = usePathname();
  const { friends, following } = useContext(
    DISTRIBUTION_CONTEXT.appStateContext
  );

  const { data: videos } = useQuery({
    queryKey: ["friends_feed", following.length, friends.length],
    queryFn: async () => {
      return await getVideosFromFriendsWithUrlsFromStorage(friends);
    },
  });

  const [stoppedVideo, setStoppedVideo] = useState(false);
  const [viewableIndex, setViewableIndex] = useState(-1);

  useEffect(() => {
    if (pathname !== "/friends") {
      setStoppedVideo(true);
      setViewableIndex(-1);
    } else {
      setStoppedVideo(false);
    }
  }, [pathname]);

  return (
    <View className="flex-1 relative items-center justify-center bg-black">
      <Header
        title="Friends"
        classNames={{ root: "absolute z-50 top-10 left-0 right-0" }}
      />
      <VirtualizedList
        keyExtractor={(item: Video) => item.id.toString()}
        snapToInterval={Dimensions.get("window").height}
        snapToStart
        onViewableItemsChanged={({ viewableItems }) => {
          setViewableIndex(viewableItems[0].index || 0);
        }}
        removeClippedSubviews
        getItemLayout={(_, index) => ({
          length: Dimensions.get("window").height,
          offset: Dimensions.get("window").height * index,
          index,
        })}
        decelerationRate="fast"
        data={videos}
        getItemCount={() => videos?.length || 0}
        getItem={(videos, index) => videos[index]}
        className="h-full"
        renderItem={({ item, index }) => (
          <FeedVideo
            item={item}
            show={viewableIndex === index && !stoppedVideo}
          />
        )}
        ListEmptyComponent={
          <SafeAreaView className="items-center py-48">
            <Ionicons name="sad" size={60} color="white" />
            <Text className="text-white text-xl mt-auto">No friends yet</Text>
          </SafeAreaView>
        }
      />
    </View>
  );
}
