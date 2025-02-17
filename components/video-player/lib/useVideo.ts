import { useEvent } from "expo";
import { useVideoPlayer } from "expo-video";

type Props = {
  uri: string;
};

export const useVideo = ({ uri }: Props) => {
  const videoPlayer = useVideoPlayer(uri, (player) => {
    player.loop = true;
  });

  const { isPlaying: videoIsPlaying } = useEvent(videoPlayer, "playingChange", {
    isPlaying: videoPlayer.playing,
  });

  return { videoPlayer, videoIsPlaying };
};
