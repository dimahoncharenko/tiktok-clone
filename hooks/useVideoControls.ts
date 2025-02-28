import { useRouter } from "expo-router";
import { Share } from "react-native";

import { Video } from "@/shared/types/video";
import { useAuthContext } from "@/shared/context/AuthProvider";

type Props = {
  video: Video;
};

export const useVideoConrols = ({ video }: Props) => {
  const router = useRouter();
  const { user } = useAuthContext();

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

  return { handleShare, handleEnterUserScreen, handleEnterComments };
};
