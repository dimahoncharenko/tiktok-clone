import { Dimensions, View, VirtualizedList } from "react-native";
import { useEffect, useState } from "react";
import { usePathname } from "expo-router";

import { FeedVideo } from "@/components/feed-video";
import { parseVideoUrlsFromStorage } from "@/lib/feed/utils";
import { Header } from "@/components/header";
import { Video } from "@/shared/types/video";

export default function HomeScreen() {
  const pathname = usePathname();

  const [videos, setVideos] = useState<Video[]>([]);
  const [stoppedVideo, setStoppedVideo] = useState(false);
  const [viewableIndex, setViewableIndex] = useState(-1);

  useEffect(() => {
    if (pathname !== "/") {
      setStoppedVideo(true);
    } else {
      setStoppedVideo(false);
    }
  }, [pathname]);

  useEffect(() => {
    (async () => {
      try {
        await parseVideoUrlsFromStorage(setVideos);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <View className="flex-1 relative items-center justify-center">
      <Header
        title="For You"
        classNames={{ root: "absolute z-50 top-10 left-0 right-0" }}
      />
      <VirtualizedList
        keyExtractor={(item: any) => item.id.toString()}
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
    </View>
  );
}
