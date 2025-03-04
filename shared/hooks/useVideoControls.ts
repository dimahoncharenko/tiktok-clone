import { useRouter } from "expo-router";
import { Share } from "react-native";
import { useContext } from "react";

import { useAuthContext } from "@/shared/context/auth-provider";
import { Video } from "@/shared/types/video";
import { likeService } from "../lib/likes";
import { DISTRIBUTION_CONTEXT } from "../context/distribution-context";

type Props = {
  video: Video;
  likeId?: string;
};

export const useVideoControls = ({ video, likeId }: Props) => {
  const router = useRouter();
  const { user } = useAuthContext();
  const { setLikes, followUser, unfollowUser } = useContext(
    DISTRIBUTION_CONTEXT.appActionsContext
  );

  const handleEnterComments = () => {
    if (!user) return router.replace("/(auth)");

    router.push({
      pathname: "/comments/[id]",
      params: { id: video.id },
    });
  };

  const handleEnterUserScreen = () => {
    if (!user) return router.replace("/(auth)");

    router.push({ pathname: "/user/[id]", params: { id: user.id } });
  };

  const handleShare = () => {
    Share.share({
      title: video.title,
      message: `Check out this video! URL: ${video.signedUrl}`,
      url: `${video.signedUrl}`,
    });
  };

  const handleLikeUnlike = async () => {
    try {
      if (!likeId) {
        const res = await likeService.likeVideo(video.id, `${user?.id}`);
        setLikes((prev) => prev.concat(res));
      } else {
        await likeService.removeLikeVideo(video.id, `${user?.id}`);
        await likeService.getLikesByUser(`${user?.id}`);

        setLikes((prev) => prev.filter((like) => like.id !== likeId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollowUser = async () => {
    if (!user) return;

    try {
      await followUser(user, video.User.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnfollowUser = async () => {
    if (!user) return;

    try {
      await unfollowUser(user, video.User.id);
    } catch (err) {
      console.error(err);
    }
  };

  return {
    handleShare,
    handleEnterUserScreen,
    handleEnterComments,
    handleLikeUnlike,
    handleFollowUser,
    handleUnfollowUser,
  };
};
