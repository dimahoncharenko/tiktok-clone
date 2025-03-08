import { supabase } from "@/shared/config/supabase.config";
import { parseVideoUrls } from "@/shared/lib/utils";
import { videoService } from "@/shared/lib/videos";
import { RealtimeChannel } from "@supabase/supabase-js";

export const getVideosWithUrlsFromStorage = async () => {
  const videos = await videoService.getAllVideos();
  const parsedVideos = await parseVideoUrls(videos);

  return parsedVideos;
};

type SubscribeToFeedChanges = {
  onChangeCallback: () => void;
};

export const subscribeToFeedChanges = ({
  onChangeCallback,
}: SubscribeToFeedChanges) => {
  return supabase
    .channel("follower_changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "Follower",
      },
      onChangeCallback
    )
    .subscribe();
};

export const unsubscribeFromFeedChanges = (channel: RealtimeChannel) => {
  supabase.removeChannel(channel);
};
