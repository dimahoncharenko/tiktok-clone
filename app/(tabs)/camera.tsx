import { Button, Text, TouchableOpacity, View } from "react-native";
import {
  Camera,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useEffect, useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { supabase } from "@/shared/config/supabase.config";
import { useAuthContext } from "@/shared/context/AuthProvider";

export default function CameraScreen() {
  const { user } = useAuthContext();

  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [recordPermissions, setRecordingPermissions] = useState(false);
  const [videoUri, setVideoUri] = useState("");

  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const soundStatus = await Camera.requestMicrophonePermissionsAsync();

      setRecordingPermissions(cameraStatus.granted && soundStatus.granted);
    })();
  }, []);

  if (!permission) return null;

  if (!permission.granted || !recordPermissions)
    return (
      <View className="flex-1 justify-center">
        <Text className="text-center pb-[10px]">
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      cameraRef.current?.stopRecording();
    } else {
      setIsRecording(true);
      const video = await cameraRef.current?.recordAsync();
      video?.uri && setVideoUri(video.uri);
    }
  };

  const saveVideo = async () => {
    console.log(videoUri);

    const formData = new FormData();
    const fileName = videoUri.split("/").pop();
    formData.append("file", {
      uri: videoUri,
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

    console.log(data, user);

    const { error: insertError } = await supabase.from("Video").insert({
      uri: data?.path,
      user_id: user?.id,
      title: "Test title added.",
    });

    if (insertError) console.error(insertError);
  };

  return (
    <View className="flex-1 justify-center">
      <CameraView
        mode="video"
        ref={cameraRef}
        style={{
          flex: 1,
        }}
        facing={facing}
      >
        <View className="flex-1 flex-row bg-transparent my-12 justify-between">
          <View className="flex-1 self-end items-center" />

          {videoUri ? (
            <TouchableOpacity
              className="flex-1 self-end items-center"
              onPress={saveVideo}
            >
              <Ionicons name="checkmark-circle" size={90} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="flex-1 self-end items-center"
              onPress={toggleRecording}
            >
              <Ionicons
                name={isRecording ? "pause-circle-outline" : "radio-button-on"}
                size={90}
                color={isRecording ? "white" : "red"}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="flex-1 self-end mb-7 items-center"
            onPress={toggleCameraFacing}
          >
            <Ionicons
              name={
                facing === "front" ? "camera-reverse" : "camera-reverse-outline"
              }
              size={45}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}
