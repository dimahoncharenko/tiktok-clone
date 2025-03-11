import { twMerge } from "tailwind-merge";
import clsx, { ClassValue } from "clsx";

import { supabase } from "../config/supabase.config";
import { Video } from "../types/video";
import { Follower, Following } from "../types/follower";
import { SUPABASE_STORAGE_KEYS } from "../constants/storage";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export abstract class InitService {
  protected client: typeof supabase;

  constructor() {
    this.client = supabase;
  }
}
export const isArrayNotEmpty = <T>(
  array: T[] | undefined | null
): array is T[] => {
  return array != null && array.length > 0;
};

type ParsedVideo = Video & { signedUrl: string | null };

async function getSignedUrls(videos: Video[]) {
  const cacheTime = 60 * 60 * 24 * 7;

  const { data, error } = await supabase.storage
    .from("videos")
    .createSignedUrls(
      videos.map((video) => video.uri),
      cacheTime
    );

  if (error) throw error;

  return data;
}

export const parseVideoUrls = async (videos: Video[]) => {
  try {
    const response = await getSignedUrls(videos);
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
