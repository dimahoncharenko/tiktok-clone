import { supabase } from "../config/supabase.config";

type VideoRecordParams = {
  uri: string;
  user_id: string;
  title: string;
};

type VideoRequestParams = {
  name: string;
  body: FormData;
};

class StorageService {
  private client: typeof supabase;

  constructor() {
    this.client = supabase;
  }

  async addToVideoTable(params: VideoRecordParams) {
    const { error } = await this.client.from("Video").insert(params);
    if (error) throw error;
  }

  async addVideoToStorageAndQuery({ body, name }: VideoRequestParams) {
    const { data, error } = await supabase.storage
      .from("videos")
      .upload(name, body, {
        upsert: false,
        cacheControl: "3600000000",
      });

    if (error) throw error;

    return data;
  }
}

export const storageService = new StorageService();
