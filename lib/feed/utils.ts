import { storageService } from "@/shared/lib/utils";
import { Video } from "@/shared/types/video";

type ParsedVideo = Video & { signedUrl: string | null };

export const parseVideoUrls = async (videos: Video[]) => {
  try {
    const response = await storageService.getSignedUrls(videos);

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

export const parseVideoUrlsFromStorage = async (
  callback?: (parsed: ParsedVideo[]) => void
) => {
  const videos = await storageService.getAllVideos();
  const parsedVideos = await parseVideoUrls(videos);

  parsedVideos && callback?.(parsedVideos);
};
