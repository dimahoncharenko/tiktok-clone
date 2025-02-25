import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { twMerge } from "tailwind-merge";
import clsx, { ClassValue } from "clsx";

import { supabase } from "../config/supabase.config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type VideoRecordParams = {
  uri: string;
  user_id: string;
  title: string;
};

type VideoRequestParams = {
  name: string;
  body: FormData;
};

type UserRecordParams = {
  email: string;
  id: string;
  username: string;
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
    const { data, error } = await this.client.storage
      .from("videos")
      .upload(name, body, {
        upsert: false,
        cacheControl: "3600000000",
      });

    if (error) throw error;

    return data;
  }

  async getAllVideos() {
    const { data, error } = await this.client
      .from("Video")
      .select("*, User(username)")
      .order("createdAt", { ascending: false });

    if (error) throw error;

    return data;
  }

  async getSignedUrls(videos: any[]) {
    const cacheTime = 60 * 60 * 24 * 7;

    const { data, error } = await this.client.storage
      .from("videos")
      .createSignedUrls(
        videos.map((video) => video.uri),
        cacheTime
      );

    if (error) throw error;

    return data;
  }

  async getUser(id: string) {
    const { data, error } = await this.client
      .from("User")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  }

  async addUser({ email, id, username }: UserRecordParams) {
    const { error } = await supabase.from("User").insert({
      email,
      id,
      username,
    });

    if (error) throw error;
  }
}

export const storageService = new StorageService();

type SignInCommonStrategy = {
  email: string;
  password: string;
};

type SignUpCommonStrategy = SignInCommonStrategy;

class AuthService {
  private client: typeof supabase;

  constructor() {
    this.client = supabase;
  }

  subscribeToAuthChange(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    const { data } = this.client.auth.onAuthStateChange(callback);
    return { unsubscribe: data.subscription.unsubscribe };
  }

  async signInWithEmailAndPassword({ email, password }: SignInCommonStrategy) {
    const response = await this.client.auth.signInWithPassword({
      email,
      password,
    });

    if (response.error) throw response.error;

    return response;
  }

  async signUpWithEmailAndPassword({ email, password }: SignUpCommonStrategy) {
    const response = await this.client.auth.signUp({
      email: `${email}`,
      password: `${password}`,
    });

    if (response.error) throw response.error;

    return response;
  }

  async signOut() {
    const { error } = await this.client.auth.signOut();

    if (error) throw error;
  }
}

export const authService = new AuthService();
