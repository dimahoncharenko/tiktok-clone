import { Button, Text, View } from "react-native";

type Props = {
  requestPermission: () => void;
};

export const PermissionDisplayError = ({ requestPermission }: Props) => {
  return (
    <View className="flex-1 justify-center">
      <Text className="text-center pb-[10px]">
        We need your permission to show the camera
      </Text>
      <Button onPress={requestPermission} title="grant permission" />
    </View>
  );
};
