import { ChatMessage } from "@/shared/types/chat";
import { InitService } from "../utils";

class ChatService extends InitService {
  async getChat(users_key: string) {
    const { data, error } = await this.client
      .from("Chat")
      .select("*, User(*)")
      .eq("users_key", users_key);

    if (error) throw error;

    return data as ChatMessage[];
  }

  async sendMessage({
    chat_user_id,
    message,
    user_id,
  }: {
    chat_user_id: string;
    message: string;
    user_id: string;
  }) {
    const { error } = await this.client.from("Chat").insert({
      content: message,
      user_id,
      chat_user_id,
      users_key: ChatService.getUsersKey(chat_user_id, user_id),
    });

    if (error) throw error;
  }

  static getUsersKey(chat_user_id: string, user_id: string) {
    return [chat_user_id, user_id].sort().join(":");
  }
}

export const getUsersKey = ChatService.getUsersKey;
export const chatService = new ChatService();
