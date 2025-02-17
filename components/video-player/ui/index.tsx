import { VideoView } from "expo-video";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { Camera } from "expo-camera";

import { useVideo } from "../lib/useVideo";
import { supabase } from "@/shared/config/supabase.config";
import { useAuthContext } from "@/shared/context/AuthProvider";
import Ionicons from "@expo/vector-icons/Ionicons";

type Props = {
  uri: string;
};

export const VideoPlayer = ({ uri }: Props) => {
  const { user } = useAuthContext();
  const { videoPlayer, videoIsPlaying } = useVideo({ uri });
  const [recordPermissions, setRecordingPermissions] = useState(false);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const soundStatus = await Camera.requestMicrophonePermissionsAsync();

      setRecordingPermissions(cameraStatus.granted && soundStatus.granted);
    })();
  }, []);

  if (!recordPermissions) return null;

  const saveVideo = async () => {
    const formData = new FormData();
    const fileName = uri.split("/").pop();
    formData.append("file", {
      uri,
      name: `${fileName}`,
      type: `video/${fileName?.split(".").pop()}`,
    } as unknown as Blob);

    const { data, error } = await supabase.storage
      .from("videos")
      .upload(`${fileName}`, formData, {
        upsert: false,
        cacheControl: "3600000000",
      });

    if (error) console.error(error);

    const { error: insertError } = await supabase.from("Video").insert({
      uri: data?.path,
      user_id: user?.id,
      title: "Test title added.",
    });

    if (insertError) console.error(insertError);
  };

  const { height, width } = Dimensions.get("window");

  return (
    <View className="flex-1 items-center justify-center">
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
        <TouchableOpacity onPress={saveVideo}>
          <Ionicons name="add-circle" size={70} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="mb-[10px]">
          <Ionicons size={50} name="close-circle-outline" color="white" />
        </TouchableOpacity>
      </View>
      <VideoView
        className="flex-1"
        style={{
          flex: 1,
          width,
          height,
          backgroundColor: "black",
        }}
        player={videoPlayer}
        contentFit="cover"
        nativeControls={false}
      />
    </View>
  );
};
