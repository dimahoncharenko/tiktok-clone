import { Text, TouchableOpacity, View } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

import { useAuthContext } from "@/shared/context/AuthProvider";
import { useVideoConrols } from "@/hooks/useVideoControls";
import { Video } from "@/shared/types/video";

type Props = {
  video: Video;
};

export const VideoFeedOverlay = ({ video }: Props) => {
  const { user } = useAuthContext();
  const { handleShare, handleEnterUserScreen, handleEnterComments } =
    useVideoConrols({ video });

  return (
    <View
      className="absolute px-3 py-6 left-0 right-0 bottom-0"
      style={{ zIndex: 200 }}
    >
      <View className="flex-row justify-between">
        <View className="mt-auto">
          <Text className="text-white text-2xl font-semibold">
            {user?.username}
          </Text>
          <Text className="text-white text-lg font-medium">{video.title}</Text>
        </View>
        <View className="gap-4">
          <TouchableOpacity onPress={handleEnterUserScreen}>
            <Ionicons name="person" size={35} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="heart" size={35} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEnterComments}>
            <Ionicons name="chatbubble-ellipses" size={35} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare}>
            <FontAwesome name="share" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
