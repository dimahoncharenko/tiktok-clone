import { useRouter } from "expo-router";
import { Share } from "react-native";
import { useContext } from "react";

import { useAuthContext } from "@/shared/context/AuthProvider";
import { Video } from "@/shared/types/video";
import { likeService } from "../lib/likes";
import { appStateContext } from "../context/app-state";
import { userService } from "../lib/user";

type Props = {
  video: Video;
  likeId?: string;
};

export const useVideoControls = ({ video, likeId }: Props) => {
  const router = useRouter();
  const { user } = useAuthContext();
  const { setLikes, getFollowers, getFollowings } = useContext(appStateContext);

  const handleEnterComments = () => {
    if (!user) return router.replace("/(auth)");

    router.push({ pathname: "/comments/[id]", params: { id: video.id } });
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
      }
      {
        await likeService.removeLikeVideo(video.id, `${user?.id}`);
        await likeService.getLikesByUser(`${user?.id}`);

        setLikes((prev) => prev.filter((like) => like.id !== likeId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const followUser = async () => {
    try {
      await userService.followUser(`${user?.id}`, video.User.id);
      user && getFollowings(user);
    } catch (err) {
      console.error(err);
    }
  };

  const unfollowUser = async () => {
    try {
      await userService.unfollowUser(`${user?.id}`, video.User.id);
      user && getFollowings(user);
    } catch (err) {
      console.error(err);
    }
  };

  return {
    handleShare,
    handleEnterUserScreen,
    handleEnterComments,
    handleLikeUnlike,
    followUser,
    unfollowUser,
  };
};
