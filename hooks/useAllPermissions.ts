import { Camera, useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";

export const useAllPermissions = () => {
  const [recordPermissions, setRecordingPermissions] = useState(false);
  const [cameraPermitted, requestCameraPermission] = useCameraPermissions();

  const requestRecordPermissions = async () => {
    const cameraStatus = await Camera.requestCameraPermissionsAsync();
    const soundStatus = await Camera.requestMicrophonePermissionsAsync();

    setRecordingPermissions(cameraStatus.granted && soundStatus.granted);
  };

  useEffect(() => {
    (async () => {
      await requestRecordPermissions();
    })();
  }, []);

  return {
    recordPermissions,
    cameraPermitted,
    requestCameraPermission,
    requestRecordPermissions,
  };
};
