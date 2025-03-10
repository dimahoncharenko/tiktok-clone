import { Video } from "@/shared/types/video";
import { Friend } from "../friends/utils";
import { InitService } from "../utils";
import { SUPABASE_STORAGE_KEYS } from "@/shared/constants/storage";

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

  async getVideosFromFriends(friends: Friend[]) {
    if (!friends.length) return [];

    const { error, data } = await this.client
      .from("Video")
      .select("*, User(*)")
      .in(
        "user_id",
        friends.map((friend) => friend.User.id)
      )
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
      .from(SUPABASE_STORAGE_KEYS.VIDEOS)
      .upload(name, body, {
        upsert: false,
        cacheControl: "3600000000",
      });

    if (error) throw error;

    return data;
  }
}

export const videoService = new VideoService();
