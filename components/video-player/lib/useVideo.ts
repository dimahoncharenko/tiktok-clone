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
  console.log("Passed uri: ", uri);

  const videoPlayer = useVideoPlayer(uri, (player) => {
    playerConfig(player);
  });

  console.log("Received video player: ", videoPlayer);

  const { isPlaying: videoIsPlaying } = useEvent(videoPlayer, "playingChange", {
    isPlaying: videoPlayer.playing,
  });

  console.log("Player: ", videoPlayer);

  return { videoPlayer, videoIsPlaying };
};
