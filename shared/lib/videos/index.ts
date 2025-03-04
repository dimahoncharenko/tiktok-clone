import { supabase } from "@/shared/config/supabase.config";
import { Video } from "@/shared/types/video";
import { InitService } from "../utils";

type VideoRecordParams = {
  uri: string;
  user_id: string;
  title: string;
};

type VideoRequestParams = {
  name: string;
  body: FormData;
};

export class VideoService extends InitService {
  async getAllVideos() {
    const { data, error } = await this.client
      .from("Video")
      .select("*, User(*)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data as Video[];
  }

  async getVideoById(videoId: string) {
    const { data, error } = await this.client
      .from("Video")
      .select("*, User(username)")
      .eq("id", videoId)
      .maybeSingle();

    if (error) throw error;

    return data as Video;
  }

  async addToVideoTable(params: VideoRecordParams) {
    const { error } = await this.client.from("Video").insert(params);
    if (error) throw error;
  }

  async addVideoToStorageAndQuery({ body, name }: VideoRequestParams) {
    const { data, error } = await this.client.storage
      .from("videos")
      .upload(name, body, {
        upsert: false,
        cacheControl: "3600000000",
      });

    if (error) throw error;

    return data;
  }

  static async getSignedUrls(videos: Video[]) {
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
}

export const videoService = new VideoService();
