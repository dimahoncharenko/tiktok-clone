import { useEvent } from "expo";
import { Camera } from "expo-camera";
import { VideoPlayer, useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";

type Props = {
  uri: string;
  playerConfig?(player: VideoPlayer): void;
  stop?: boolean;
};

const defaultPlayerConfig: Props["playerConfig"] = (player) => {
  player.loop = true;
};

export const useVideo = ({
  uri,
  playerConfig = defaultPlayerConfig,
  stop,
}: Props) => {
  const [recordPermissions, setRecordingPermissions] = useState(false);

  const videoPlayer = useVideoPlayer(uri, (player) => {
    playerConfig(player);
  });

  const { isPlaying: videoIsPlaying } = useEvent(videoPlayer, "playingChange", {
    isPlaying: videoPlayer.playing,
  });

  useEffect(() => {
    if (!stop) {
      videoPlayer.replay();
    } else {
      videoPlayer.pause();
    }
  }, [stop]);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const soundStatus = await Camera.requestMicrophonePermissionsAsync();

      setRecordingPermissions(cameraStatus.granted && soundStatus.granted);
    })();
  }, []);

  return { videoPlayer, videoIsPlaying, permitted: recordPermissions };
};
