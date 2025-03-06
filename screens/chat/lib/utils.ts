import { supabase } from "@/shared/config/supabase.config";
import { chatService } from "@/shared/lib/chat";
import { RealtimeChannel } from "@supabase/supabase-js";

type SubscribeToChatByIDProps = {
  usersKey: string;
  onChangeCallback: () => void;
};

export const subscribeToChatByID = ({
  onChangeCallback,
  usersKey,
}: SubscribeToChatByIDProps) => {
  return supabase
    .channel(usersKey)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "Chat",
        filter: `users_key.${usersKey}`,
      },
      onChangeCallback
    )
    .subscribe();
};

export const unsubscribeFromChat = (channel: RealtimeChannel) => {
  supabase.removeChannel(channel);
};

export class Message {
  public chat_user_id: string;
  public user_id: string;
  public message: string;

  constructor(chat_user_id: string, user_id: string, message: string) {
    this.chat_user_id = chat_user_id;
    this.user_id = user_id;
    this.message = message;
  }
}

export const sendMessage = async (newMessage: Message) => {
  await chatService.sendMessage(newMessage);
};
