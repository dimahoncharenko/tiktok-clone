import { usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, View, VirtualizedList } from "react-native";

import {
  getVideosWithUrlsFromStorage,
  subscribeToFeedChanges,
  unsubscribeFromFeedChanges,
} from "../lib";
import { FeedVideo } from "@/components/feed-video";
import { Video } from "@/shared/types/video";
import { Header } from "@/components/header";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isArrayNotEmpty } from "@/shared/lib/utils";

export function HomeScreen() {
  const pathname = usePathname();

  const queryClient = useQueryClient();
  const { data: videos } = useQuery({
    queryKey: ["feed"],
    queryFn: async () => {
      return await getVideosWithUrlsFromStorage();
    },
  });

  const [stoppedVideo, setStoppedVideo] = useState(false);
  const [viewableIndex, setViewableIndex] = useState(-1);

  useEffect(() => {
    const channel = subscribeToFeedChanges({
      onChangeCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["feed"] });
      },
    });

    return () => {
      unsubscribeFromFeedChanges(channel);
    };
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setStoppedVideo(true);
      setViewableIndex(-1);
    } else {
      setStoppedVideo(false);
    }
  }, [pathname]);

  return (
    <View className="flex-1 relative items-center justify-center">
      <Header
        title="For You"
        classNames={{ root: "absolute z-50 top-10 left-0 right-0" }}
      />
      {isArrayNotEmpty(videos) && (
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
          getItemCount={() => videos.length}
          getItem={(videos, index) => videos[index]}
          className="h-full"
          renderItem={({ item, index }) => (
            <FeedVideo
              item={item}
              show={viewableIndex === index && !stoppedVideo}
            />
          )}
        />
      )}
    </View>
  );
}
