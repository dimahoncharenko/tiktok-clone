import Ionicons from "@expo/vector-icons/Ionicons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

import { PermissionDisplayError } from "@/components/permission-display-error";

type Props = {
  recordVideo: (value: React.SetStateAction<string>) => void;
};

export const CameraControls = ({ recordVideo }: Props) => {
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [isRecording, setIsRecording] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) return null;
  if (!permission.granted)
    return <PermissionDisplayError requestPermission={requestPermission} />;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });

    result?.assets?.[0] && recordVideo(result.assets[0].uri);
  };

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
      video?.uri && recordVideo(video.uri);
    }
  };

  return (
    <CameraView
      mode="video"
      ref={cameraRef}
      style={{
        flex: 1,
      }}
      facing={facing}
    >
      <View className="flex-1 flex-row bg-transparent my-12 justify-between">
        <TouchableOpacity
          className="flex-1 self-end mb-5 items-center"
          onPress={pickImage}
        >
          <Ionicons name="aperture" size={50} color="white" />
        </TouchableOpacity>
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
  );
};
