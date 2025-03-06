import { Text, TouchableOpacity, View } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useContext, useEffect } from "react";

import { useAuthContext } from "@/shared/context/auth-provider";
import { useVideoControls } from "@/shared/hooks/useVideoControls";
import { DISTRIBUTION_CONTEXT } from "@/shared/context/distribution-context";
import { isItFollowed, isItLiked } from "../lib/utils";
import { Video } from "@/shared/types/video";

type Props = {
  video: Video;
};

export const VideoFeedOverlay = ({ video }: Props) => {
  const { user } = useAuthContext();
  const { likes, following } = useContext(DISTRIBUTION_CONTEXT.appStateContext);

  const { getFollowers, getFollowings } = useContext(
    DISTRIBUTION_CONTEXT.appActionsContext
  );

  const likeId = isItLiked(likes, video.id, `${user?.id}`);

  useEffect(() => {
    if (!user) return;
    (async () => {
      await getFollowers(user.id);
      await getFollowings(user.id);
    })();
  }, [user]);

  const {
    handleShare,
    handleEnterUserScreen,
    handleEnterComments,
    handleLikeUnlike,
    handleFollowUser,
    handleUnfollowUser,
  } = useVideoControls({ video, likeId: likeId?.id });

  return (
    <View
      className="absolute px-3 py-6 left-0 right-0 bottom-2"
      style={{ zIndex: 200 }}
    >
      <View className="flex-row justify-between">
        <View className="mt-auto">
          <Text className="text-white text-2xl font-semibold">
            {video.User.username}
          </Text>
          <Text className="text-white text-lg font-medium">{video.title}</Text>
        </View>
        <View className="gap-4">
          <View className="relative">
            <TouchableOpacity onPress={handleEnterUserScreen}>
              <Ionicons name="person" size={35} color="white" />
            </TouchableOpacity>
            {isItFollowed(following, `${user?.id}`, video.User.id) ? (
              <TouchableOpacity>
                <TouchableOpacity
                  className="absolute -bottom-2 right-0 bg-white rounded-full"
                  onPress={handleUnfollowUser}
                >
                  <Ionicons name="remove-circle" size={20} color="red" />
                </TouchableOpacity>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity>
                <TouchableOpacity
                  className="absolute -bottom-2 right-0 bg-white rounded-full"
                  onPress={handleFollowUser}
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
