import { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";

import { storageService } from "@/shared/lib/utils";
import { VideoPlayer } from "@/components/video-player";
import { FlatList } from "react-native";

export default function HomeScreen() {
  const [videos, setVideos] = useState<any[]>([]);

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
      <FlatList
        keyExtractor={(item) => item.id.toString()}
        snapToInterval={Dimensions.get("window").height}
        snapToStart
        removeClippedSubviews
        getItemLayout={(_, index) => ({
          length: Dimensions.get("window").height,
          offset: Dimensions.get("window").height * index,
          index,
        })}
        decelerationRate="fast"
        data={videos.slice(1)}
        className="h-full"
        renderItem={({ item }) => {
          if (!item?.signedUrl) {
            return <View className="h-full bg-black" />;
          }
          return (
            <VideoPlayer
              playerConfig={(player) => {
                player.loop = true;
                player.play();
              }}
              kind="feed"
              uri={item.signedUrl}
            />
          );
        }}
      />
    </View>
  );
}
