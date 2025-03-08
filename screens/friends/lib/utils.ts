import { Friend } from "@/shared/lib/friends/utils";
import { parseVideoUrls } from "@/shared/lib/utils";
import { videoService } from "@/shared/lib/videos";

export const getVideosFromFriendsWithUrlsFromStorage = async (
  friends: Friend[]
) => {
  const videos = await videoService.getVideosFromFriends(friends);
  const parsedVideos = videos.length ? await parseVideoUrls(videos) : [];

  return parsedVideos;
};

export const areThereFriends = (friends: Friend[]) => {
  return !!friends.length;
};
