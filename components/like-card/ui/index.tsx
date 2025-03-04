import { useAuthContext } from "@/shared/context/auth-provider";
import { formatDate } from "@/shared/lib/date/utils";
import { videoService } from "@/shared/lib/videos";
import { Like } from "@/shared/types/like";
import { UserMessage } from "@/shared/ui-blocks/user-message";
import { useQuery } from "@tanstack/react-query";

type Props = {
  username: string;
  like: Like;
};

export const LikeCard = ({ username, like }: Props) => {
  const { user } = useAuthContext();
  const { data } = useQuery({
    queryKey: ["video", like.video_id],
    queryFn: async () => await videoService.getVideoById(like.video_id),
  });

  const isItMyVideo = data && data.user_id === user?.id;

  return (
    <UserMessage
      imageSource={{ uri: "https://placehold.co/40x40" }}
      heading={username}
      content={
        isItMyVideo
          ? "You liked your video"
          : `Liked ${data?.User.username}'s video`
      }
      timestamp={formatDate(like.created_at)}
    />
  );
};
