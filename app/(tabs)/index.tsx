import { Dimensions, View, VirtualizedList } from "react-native";
import { useEffect, useState } from "react";
import { usePathname } from "expo-router";

import { storageService } from "@/shared/lib/utils";
import { VideoPlayer } from "@/components/video-player";

export default function HomeScreen() {
  const pathname = usePathname();

  const [videos, setVideos] = useState<any[]>([]);
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
        const videos = await storageService.getAllVideos();
        const parsedVideos = await parseVideoUrls(videos);
        parsedVideos && setVideos(parsedVideos);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const parseVideoUrls = async (videos: any[]) => {
    try {
      const response = await storageService.getSignedUrls(videos);

      const urls: any[] = videos
        .map((item) => {
          const signedUrl = response.find(
            (url) => url.path === item.uri
          )?.signedUrl;
          return signedUrl ? { ...item, signedUrl } : null;
        })
        .filter(Boolean);

      return urls;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
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
        renderItem={({ item, index }) => {
          if (!item?.signedUrl) {
            return <View className="h-full bg-black" />;
          }
          return (
            <VideoPlayer
              playerConfig={(player) => {
                player.loop = true;
                player.play();
              }}
              viewable={viewableIndex === index && !stoppedVideo}
              kind="feed"
              uri={item.signedUrl}
            />
          );
        }}
      />
    </View>
  );
}
