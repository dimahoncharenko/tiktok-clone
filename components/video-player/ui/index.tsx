import { VideoPlayer as TVideoPlayer, VideoView } from "expo-video";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { Camera } from "expo-camera";

import { useVideo } from "../lib/useVideo";
import { useAuthContext } from "@/shared/context/AuthProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { saveUserVideo } from "../lib/utils";
import { useRouter } from "expo-router";
import clsx from "clsx";

type Props = {
  uri: string;
  kind: "record" | "feed";
  playerConfig?(player: TVideoPlayer): void;
};

export const VideoPlayer = ({ uri, kind, playerConfig }: Props) => {
  const router = useRouter();
  const { user } = useAuthContext();

  const { videoPlayer, videoIsPlaying } = useVideo({ uri, playerConfig });
  const [recordPermissions, setRecordingPermissions] = useState(false);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const soundStatus = await Camera.requestMicrophonePermissionsAsync();

      setRecordingPermissions(cameraStatus.granted && soundStatus.granted);
    })();
  }, []);

  if (!recordPermissions) return null;

  const turnBack = () => {
    router.replace("/camera");
  };

  const handleSave = async () => {
    try {
      await saveUserVideo(`${user?.id}`, uri);
      turnBack();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose = () => {
    turnBack();
  };

  const reserveTabsHeight = (height: number) => {
    return height - 50;
  };

  const { height, width } = Dimensions.get("window");

  return (
    <View
      className={clsx(
        "flex-1 items-center",
        kind === "record" && "justify-center"
      )}
    >
      <View className="absolute z-10 pb-5 left-0 right-0 bottom-0 top-0 flex justify-center items-end flex-row gap-5">
        <TouchableOpacity
          className="mb-[10px]"
          onPress={() => {
            if (videoIsPlaying) {
              videoPlayer.pause();
            } else {
              videoPlayer.play();
            }
          }}
        >
          <Ionicons
            color="white"
            name={
              videoIsPlaying ? "pause-circle-outline" : "play-circle-outline"
            }
            size={50}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave}>
          <Ionicons name="add-circle" size={70} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="mb-[10px]" onPress={handleClose}>
          <Ionicons size={50} name="close-circle-outline" color="white" />
        </TouchableOpacity>
      </View>
      <VideoView
        className="flex-1 bg-black z-40"
        style={{
          width,
          height: kind === "feed" ? reserveTabsHeight(height) : height,
          zIndex: 100,
        }}
        player={videoPlayer}
        contentFit="cover"
        nativeControls={false}
      />
    </View>
  );
};
