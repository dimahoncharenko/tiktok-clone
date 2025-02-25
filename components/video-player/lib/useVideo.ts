import { useEvent } from "expo";
import { VideoPlayer, useVideoPlayer } from "expo-video";

type Props = {
  uri: string;
  playerConfig?(player: VideoPlayer): void;
};

const defaultPlayerConfig: Props["playerConfig"] = (player) => {
  player.loop = true;
};

export const useVideo = ({
  uri,
  playerConfig = defaultPlayerConfig,
}: Props) => {
  const videoPlayer = useVideoPlayer(uri, (player) => {
    playerConfig(player);
  });

  const { isPlaying: videoIsPlaying } = useEvent(videoPlayer, "playingChange", {
    isPlaying: videoPlayer.playing,
  });

  return { videoPlayer, videoIsPlaying };
};
