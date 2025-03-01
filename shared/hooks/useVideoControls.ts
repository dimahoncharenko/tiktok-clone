import { useRouter } from "expo-router";
import { Share } from "react-native";

import { useAuthContext } from "@/shared/context/AuthProvider";
import { Video } from "@/shared/types/video";
import { likeService } from "../lib/likes";
import { useContext } from "react";
import { appStateContext } from "../context/app-state";

type Props = {
  video: Video;
  likeId?: string;
};

export const useVideoControls = ({ video, likeId }: Props) => {
  const router = useRouter();
  const { user } = useAuthContext();
  const { setLikes } = useContext(appStateContext);

  const handleEnterComments = () => {
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
        await likeService.likeVideo(video.id, `${user?.id}`);
      }
      {
        await likeService.removeLikeVideo(`${likeId}`);
        setLikes((prev) => prev.filter((like) => like.id !== likeId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return {
    handleShare,
    handleEnterUserScreen,
    handleEnterComments,
    handleLikeUnlike,
  };
};
