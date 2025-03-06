import { VideoService, videoService } from "@/shared/lib/videos";
import { Video } from "@/shared/types/video";

type ParsedVideo = Video & { signedUrl: string | null };

export const parseVideoUrls = async (videos: Video[]) => {
  try {
    const response = await VideoService.getSignedUrls(videos);

    const urls: ParsedVideo[] = videos
      .map((item) => {
        const signedUrl = response.find(
          (url) => url.path === item.uri
        )?.signedUrl;

        return { ...item, signedUrl: signedUrl || null };
      })
      .filter((item) => Boolean(item.signedUrl));

    return urls;
  } catch (err) {
    console.error(err);
  }
};

export const getVideosWithUrlsFromStorage = async () => {
  const videos = await videoService.getAllVideos();
  const parsedVideos = await parseVideoUrls(videos);

  return parsedVideos;
};
