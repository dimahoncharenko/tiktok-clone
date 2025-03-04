import { VideoPlayer as TVideoPlayer, VideoView } from "expo-video";
import { Dimensions, View } from "react-native";

import { useVideo } from "../lib/useVideo";
import { useAuthContext } from "@/shared/context/auth-provider";
import { saveUserVideo } from "../lib/utils";
import { VideoControls } from "./controls";

type Props = {
  uri: string;
  kind: "record" | "feed";
  playerConfig?(player: TVideoPlayer): void;
  viewable: boolean;
};

export const VideoPlayer = ({ uri, kind, playerConfig, viewable }: Props) => {
  const { user } = useAuthContext();

  const { videoPlayer, videoIsPlaying, permitted } = useVideo({
    uri,
    playerConfig,
    stop: !viewable,
  });

  if (!permitted) return null;

  const saveVideo = async () => {
    try {
      await saveUserVideo(`${user?.id}`, uri);
    } catch (err) {
      console.error(err);
    }
  };

  const { height, width } = Dimensions.get("window");

  return (
    <View
      className="relative items-center bg-slate-700"
      style={{
        height,
        width,
      }}
    >
      <VideoControls
        paused={!videoIsPlaying}
        player={videoPlayer}
        saveVideo={saveVideo}
        hidden={kind === "feed"}
      />
      <VideoView
        className="flex-1 bg-black mb-10"
        style={{
          width,
          height,
          zIndex: 100,
        }}
        player={videoPlayer}
        contentFit="cover"
        nativeControls={false}
      />
    </View>
  );
};
