import { TouchableOpacity, View } from "react-native";
import { CameraType, CameraView } from "expo-camera";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";

import { PermissionDisplayError } from "@/components/permission-display-error";
import { useAllPermissions } from "@/shared/hooks/useAllPermissions";

type Props = {
  recordVideo: (value: React.SetStateAction<string>) => void;
  uri: string;
};

export const CameraControls = ({ recordVideo }: Props) => {
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [isRecording, setIsRecording] = useState(false);
  const {
    recordPermissions,
    cameraPermitted,
    requestCameraPermission,
    requestRecordPermissions,
  } = useAllPermissions();

  if (!cameraPermitted?.granted || !recordPermissions)
    return (
      <PermissionDisplayError
        requestPermission={async () => {
          await requestCameraPermission();
          await requestRecordPermissions();
        }}
      />
    );

  console.log("RECORD PERMISSIONS: ", recordPermissions);
  console.log("CAMERA PERMISSIONS: ", cameraPermitted);

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
    const willRecord = !isRecording;

    if (willRecord && cameraRef.current) {
      try {
        setIsRecording(true);

        const video = await cameraRef.current.recordAsync();

        if (video?.uri) {
          recordVideo(video.uri);
        } else {
          console.log("No video URI returned");
        }
      } catch (error) {
        console.error("Error starting recording:", error);
        setIsRecording(false);
      }
    } else {
      try {
        setIsRecording(false);
        cameraRef.current?.stopRecording();
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }
  };

  return (
    <CameraView
      mode="video"
      ref={cameraRef}
      videoQuality="720p"
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
