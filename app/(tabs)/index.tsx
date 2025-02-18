import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { useAuthContext } from "@/shared/context/AuthProvider";
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
          item.signedUrl = response.find(
            (url) => url.path === item.uri
          )?.signedUrl;

          return item;
        })
        .filter((item) => item.signedUrl);

      return urls;
    } catch (err) {
      console.error(err);
    }
  };

  console.log("VIDEOS: ", videos);

  return (
    <View className="flex-1 items-center justify-center">
      <FlatList
        data={videos}
        renderItem={({ item }) => {
          return <VideoPlayer kind="feed" uri={item.signedUrl} />;
        }}
      />
    </View>
  );
}
