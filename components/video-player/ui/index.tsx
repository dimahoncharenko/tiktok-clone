import { VideoPlayer as TVideoPlayer, VideoView } from "expo-video";
import { Dimensions, View } from "react-native";
import { useEffect, useState } from "react";
import { Camera } from "expo-camera";

import { useVideo } from "../lib/useVideo";
import { useAuthContext } from "@/shared/context/AuthProvider";
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

  const { videoPlayer, videoIsPlaying } = useVideo({ uri, playerConfig });
  const [recordPermissions, setRecordingPermissions] = useState(false);

  useEffect(() => {
    if (viewable) {
      videoPlayer.replay();
    } else {
      videoPlayer.pause();
    }
  }, [viewable]);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const soundStatus = await Camera.requestMicrophonePermissionsAsync();

      setRecordingPermissions(cameraStatus.granted && soundStatus.granted);
    })();
  }, []);

  if (!recordPermissions) return null;

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
      className="flex items-center bg-slate-700"
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
          height: height,
          zIndex: 100,
        }}
        player={videoPlayer}
        contentFit="cover"
        nativeControls={false}
      />
    </View>
  );
};
