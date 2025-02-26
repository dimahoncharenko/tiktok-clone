import { View } from "react-native";
import { useState } from "react";

import { VideoPlayer } from "@/components/video-player";
import { CameraControls } from "@/components/camera-controls";

export default function CameraScreen() {
  const [videoUri, setVideoUri] = useState("");

  return (
    <View className="flex-1 justify-center">
      {videoUri ? (
        <VideoPlayer viewable={true} kind="record" uri={videoUri} />
      ) : (
        <CameraControls recordVideo={setVideoUri} uri={videoUri} />
      )}
    </View>
  );
}
