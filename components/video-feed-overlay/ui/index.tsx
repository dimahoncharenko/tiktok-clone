import { Text, TouchableOpacity, View } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useContext } from "react";

import { useAuthContext } from "@/shared/context/AuthProvider";
import { useVideoControls } from "@/shared/hooks/useVideoControls";
import { Video } from "@/shared/types/video";
import { appStateContext } from "@/shared/context/app-state";
import { isItLiked } from "../lib/utils";

type Props = {
  video: Video;
};

export const VideoFeedOverlay = ({ video }: Props) => {
  const { user } = useAuthContext();
  const { likes, following } = useContext(appStateContext);

  const likeId = isItLiked(likes, video.id, `${user?.id}`);

  const {
    handleShare,
    handleEnterUserScreen,
    handleEnterComments,
    handleLikeUnlike,
    followUser,
    unfollowUser,
  } = useVideoControls({ video, likeId: likeId?.id });

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
          <View className="relative">
            <TouchableOpacity onPress={handleEnterUserScreen}>
              <Ionicons name="person" size={35} color="white" />
            </TouchableOpacity>
            {following.find(
              (user) => user.follower_user_id === video.User.id
            ) ? (
              <TouchableOpacity>
                <TouchableOpacity
                  className="absolute -bottom-2 right-0 bg-white rounded-full"
                  onPress={unfollowUser}
                >
                  <Ionicons name="remove-circle" size={20} color="red" />
                </TouchableOpacity>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity>
                <TouchableOpacity
                  className="absolute -bottom-2 right-0 bg-white rounded-full"
                  onPress={followUser}
                >
                  <Ionicons name="add-circle" size={20} color="black" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={handleLikeUnlike}>
            {likeId ? (
              <Ionicons name="heart" size={35} color="white" />
            ) : (
              <Ionicons name="heart-outline" size={35} color="white" />
            )}
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
