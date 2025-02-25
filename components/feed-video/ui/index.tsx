import { VideoPlayer } from "@/components/video-player";
import { Video } from "@/shared/types/video";
import { View } from "react-native";

type Props = {
  item: Video;
  show: boolean;
};

export const FeedVideo = ({ item, show }: Props) => {
  if (!item?.signedUrl) {
    return <View className="h-full bg-black" />;
  }

  return (
    <VideoPlayer
      playerConfig={(player) => {
        player.loop = true;
        player.play();
      }}
      viewable={show}
      kind="feed"
      uri={item.signedUrl}
    />
  );
};
